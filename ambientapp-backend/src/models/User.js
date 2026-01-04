const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
    enum: ['activa', 'suspendida', 'cancelada', 'expirada'],
    default: 'activa'
  },

  // Validez temporal del usuario (días)
  validezTemporal: {
    tipo: {
      type: String,
      enum: ['7dias', '15dias', '30dias', 'ilimitado'],
      default: 'ilimitado'
    },
    fechaCreacion: {
      type: Date,
      default: Date.now
    },
    fechaExpiracion: {
      type: Date,
      default: null
    },
    diasRestantes: {
      type: Number,
      default: null
    }
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
      default: 3
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
  // Token de verificación y expiración
  verificationToken: {
    type: String,
    default: null
  },
  verificationTokenExpires: {
    type: Date,
    default: null
  },

  // Reset de contraseña
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },

  // Metadata
  ultimoAcceso: {
    type: Date,
    default: Date.now
  },

  currentSessionId: {    // 👈 NUEVO
  type: String,
  default: null
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

// Método: Generar token de verificación y setear expiración (24h por defecto)
userSchema.methods.generarTokenVerificacion = function(ttlHoras = 24) {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = token;
  this.verificationTokenExpires = Date.now() + ttlHoras * 60 * 60 * 1000;
  return token;
};

// Método: Limpiar token verificación (al verificar)
userSchema.methods.clearVerificationToken = function() {
  this.verificationToken = undefined;
  this.verificationTokenExpires = undefined;
};

// Método: Generar token de reset de contraseña (1 hora por defecto)
userSchema.methods.generarTokenResetPassword = function(ttlHoras = 1) {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + ttlHoras * 60 * 60 * 1000;
  return token;
};

// Método: Limpiar token de reset de contraseña
userSchema.methods.clearResetPasswordToken = function() {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
};

// Método: Calcular días restantes de validez temporal
userSchema.methods.calcularDiasRestantes = function() {
  // Si no tiene validez temporal o es ilimitado, retornar null
  if (!this.validezTemporal.tipo || this.validezTemporal.tipo === 'ilimitado') {
    return null;
  }

  // Si no hay fecha de expiración establecida, retornar null
  if (!this.validezTemporal.fechaExpiracion) {
    return null;
  }

  const ahora = new Date();
  const fechaExpiracion = new Date(this.validezTemporal.fechaExpiracion);

  // Calcular diferencia en milisegundos y convertir a días
  const diferenciaMilisegundos = fechaExpiracion - ahora;
  const diasRestantes = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

  // Si es negativo, el usuario ya expiró
  return Math.max(0, diasRestantes);
};

// Método: Verificar y actualizar estado de validez temporal
userSchema.methods.verificarValidezTemporal = function() {
  // Si no tiene validez temporal o es ilimitado, no hacer nada
  if (!this.validezTemporal.tipo || this.validezTemporal.tipo === 'ilimitado') {
    return { valido: true, diasRestantes: null };
  }

  const diasRestantes = this.calcularDiasRestantes();
  this.validezTemporal.diasRestantes = diasRestantes;

  // Si llegó a 0 días, marcar como expirado
  if (diasRestantes === 0) {
    this.estadoSuscripcion = 'expirada';
    return { valido: false, diasRestantes: 0, mensaje: 'Tu cuenta ha expirado' };
  }

  return { valido: true, diasRestantes };
};

// Método: Establecer validez temporal al crear usuario
userSchema.methods.establecerValidezTemporal = function(tipoDias) {
  const diasMap = {
    '7dias': 7,
    '15dias': 15,
    '30dias': 30,
    'ilimitado': null
  };

  const dias = diasMap[tipoDias];

  if (dias === null || dias === undefined) {
    this.validezTemporal.tipo = 'ilimitado';
    this.validezTemporal.fechaExpiracion = null;
    this.validezTemporal.diasRestantes = null;
    return;
  }

  const fechaCreacion = new Date();
  const fechaExpiracion = new Date(fechaCreacion);
  fechaExpiracion.setDate(fechaExpiracion.getDate() + dias);

  this.validezTemporal.tipo = tipoDias;
  this.validezTemporal.fechaCreacion = fechaCreacion;
  this.validezTemporal.fechaExpiracion = fechaExpiracion;
  this.validezTemporal.diasRestantes = dias;
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
  // Primero verificar validez temporal
  const validez = this.verificarValidezTemporal();
  if (!validez.valido) {
    return false;
  }

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
      '3 diagnósticos mensuales',
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
  this.limites.diagnosticosMes = null;
  this.limites.maxUsuarios = 5;
  this.features.exportarPDF = true;
  this.features.recomendacionesCompletas = true;
  this.features.evolucionTemporal = true;
  this.features.soportePrioritario = true;
  return this.save();
};

// Alias para compatibilidad con frontend / controllers que usan isVerified
userSchema.virtual('isVerified')
  .get(function() {
    return !!this.emailVerificado;
  })
  .set(function(value) {
    this.emailVerificado = !!value;
  });



module.exports = mongoose.model('User', userSchema);