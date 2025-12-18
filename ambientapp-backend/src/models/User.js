const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Información básica
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  
  // Información de la empresa/consultoría
  empresa: {
    type: String,
    trim: true
  },
  rut: {
    type: String,
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  
  // Tipo de suscripción (solo Free o Pro)
  tipoSuscripcion: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  
  // Estado de la suscripción
  estadoSuscripcion: {
    type: String,
    enum: ['activa', 'suspendida', 'cancelada'],
    default: 'activa'
  },
  
  // Fechas de suscripción
  fechaInicioSuscripcion: {
    type: Date,
    default: Date.now
  },
  fechaFinSuscripcion: {
    type: Date,
    default: null
  },
  
  // Límites según plan
  limites: {
    diagnosticosMes: {
      type: Number,
      default: 4
    },
    diagnosticosRealizados: {
      type: Number,
      default: 0
    },
    ultimoResetDiagnosticos: {
      type: Date,
      default: Date.now
    },
    maxUsuarios: {
      type: Number,
      default: 1
    },
    usuariosActuales: {
      type: Number,
      default: 1
    }
  },
  
  // Features habilitadas según plan
  features: {
    exportarPDF: {
      type: Boolean,
      default: false
    },
    recomendacionesCompletas: {
      type: Boolean,
      default: false
    },
    evolucionTemporal: {
      type: Boolean,
      default: false
    },
    soportePrioritario: {
      type: Boolean,
      default: false
    }
  },
  
  // Cuenta principal (para sistema multiusuario Pro)
  esCuentaPrincipal: {
    type: Boolean,
    default: true
  },
  cuentaPrincipalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Rol (para futuro admin panel)
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // Verificación de email
  emailVerificado: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  ultimoAcceso: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware: Encriptar password antes de guardar
userSchema.pre('save', async function() {
  // Solo encriptar si el password fue modificado
  if (!this.isModified('password')) {
    return;
  }
  
  // Encriptar password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método: Comparar password
userSchema.methods.compararPassword = function(passwordIngresado) {
  return bcrypt.compare(passwordIngresado, this.password);
};

// Método: Verificar y resetear límites mensuales si es necesario
userSchema.methods.verificarYResetearLimites = function() {
  if (this.tipoSuscripcion === 'pro') {
    return; // Pro no tiene límites
  }
  
  const ahora = new Date();
  const ultimoReset = new Date(this.limites.ultimoResetDiagnosticos);
  
  // Verificar si pasó un mes desde el último reset
  const unMesDespues = new Date(ultimoReset);
  unMesDespues.setMonth(unMesDespues.getMonth() + 1);
  
  if (ahora >= unMesDespues) {
    this.limites.diagnosticosRealizados = 0;
    this.limites.ultimoResetDiagnosticos = ahora;
  }
};

// Método: Verificar si puede hacer diagnósticos
userSchema.methods.puedeHacerDiagnostico = function() {
  // Si es Pro, siempre puede (ilimitado)
  if (this.tipoSuscripcion === 'pro') {
    return true;
  }
  
  // Verificar y resetear límites si es necesario
  this.verificarYResetearLimites();
  
  // Si es Free, verificar límite mensual
  return this.limites.diagnosticosRealizados < this.limites.diagnosticosMes;
};

// Método: Registrar uso de diagnóstico
userSchema.methods.registrarDiagnostico = async function() {
  if (this.tipoSuscripcion === 'pro') {
    return; // Pro no consume
  }
  
  // Verificar y resetear límites si es necesario
  this.verificarYResetearLimites();
  
  // Incrementar contador
  this.limites.diagnosticosRealizados += 1;
  await this.save();
};

// Virtual: planInfo (para frontend)
userSchema.virtual('planInfo').get(function() {
  // Verificar y resetear límites antes de devolver info
  this.verificarYResetearLimites();
  
  if (this.tipoSuscripcion === 'pro') {
    return {
      plan: 'Pro',
      diagnosticosTotales: Infinity,
      diagnosticosRestantes: Infinity,
      usuariosRestantes: this.limites.maxUsuarios - this.limites.usuariosActuales,
      caracteristicas: [
        'Diagnósticos ilimitados',
        'Hasta 5 usuarios',
        'Acceso a todas las dimensiones',
        'Exportar PDF con logo AmbientApp',
        'Recomendaciones completas',
        'Análisis de evolución temporal',
        'Soporte prioritario'
      ],
      features: this.features
    };
  }
  
  const diagnosticosRestantes = Math.max(
    0,
    this.limites.diagnosticosMes - this.limites.diagnosticosRealizados
  );
  
  return {
    plan: 'Free',
    diagnosticosTotales: this.limites.diagnosticosMes,
    diagnosticosRestantes: diagnosticosRestantes,
    usuariosRestantes: 0,
    caracteristicas: [
      '4 diagnósticos mensuales',
      '1 solo usuario',
      'Acceso a todas las dimensiones',
      'No permite exportar PDF',
      'Recomendaciones básicas',
      'Soporte normal'
    ],
    features: this.features
  };
});

// Método: Obtener información de plan actual (mantener por compatibilidad)
userSchema.methods.getInfoPlan = function() {
  return this.planInfo;
};

// Método: Actualizar a plan Pro
userSchema.methods.actualizarAPro = function() {
  this.tipoSuscripcion = 'pro';
  this.limites.diagnosticosMes = -1;
  this.limites.maxUsuarios = 5;
  this.features.exportarPDF = true;
  this.features.recomendacionesCompletas = true;
  this.features.evolucionTemporal = true;
  this.features.soportePrioritario = true;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);