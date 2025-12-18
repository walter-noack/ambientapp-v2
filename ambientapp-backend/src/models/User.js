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
  timestamps: true
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

// Método: Verificar si puede hacer diagnósticos
userSchema.methods.puedeHacerDiagnostico = function() {
  const limites = this.limites;
  
  // Si es Pro, siempre puede (ilimitado)
  if (this.tipoSuscripcion === 'pro') return true;
  
  // Si es Free, verificar límite mensual
  const ahora = new Date();
  const unMesAtras = new Date(limites.ultimoResetDiagnosticos);
  unMesAtras.setMonth(unMesAtras.getMonth() + 1);
  
  // Si pasó un mes, resetear contador
  if (ahora >= unMesAtras) {
    this.limites.diagnosticosRealizados = 0;
    this.limites.ultimoResetDiagnosticos = ahora;
  }
  
  return limites.diagnosticosRealizados < limites.diagnosticosMes;
};

// Método: Registrar uso de diagnóstico
userSchema.methods.registrarDiagnostico = function() {
  if (this.tipoSuscripcion === 'free') {
    this.limites.diagnosticosRealizados += 1;
    return this.save();
  }
  return Promise.resolve();
};

// Método: Obtener información de plan actual
userSchema.methods.getInfoPlan = function() {
  if (this.tipoSuscripcion === 'pro') {
    return {
      plan: 'Pro',
      diagnosticosRestantes: 'Ilimitados',
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
  
  const diagnosticosRestantes = this.limites.diagnosticosMes - this.limites.diagnosticosRealizados;
  return {
    plan: 'Free',
    diagnosticosRestantes: Math.max(0, diagnosticosRestantes),
    diagnosticosTotales: this.limites.diagnosticosMes,
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