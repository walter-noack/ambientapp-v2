const mongoose = require('mongoose');

const diagnosticoSchema = new mongoose.Schema({
  // Usuario propietario
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Paso 1: Información General
  companyName: {
    type: String,
    required: [true, 'El nombre de la empresa es obligatorio'],
    trim: true
  },
  semestre: {
    type: String,
    enum: ['S1', 'S2'],
    default: 'S1'
  },
  anio: {
    type: Number,
    required: true,
    default: () => new Date().getFullYear()
  },
  fechaEvaluacion: {
    type: Date,
    default: Date.now
  },
  
  // Dimensiones activadas
  dimensiones: {
    carbono: { type: Boolean, default: true },
    agua: { type: Boolean, default: true },
    residuos: { type: Boolean, default: true },
    rep: { type: Boolean, default: false }
  },
  
  // Paso 2: Huella de Carbono
  carbono: {
    diesel: { type: Number, default: 0 },
    bencina: { type: Number, default: 0 },
    gasNatural: { type: Number, default: 0 },
    otrosCombustibles: { type: Number, default: 0 },
    electricidad: { type: Number, default: 0 },
    // Resultados calculados
    emisionesScope1: { type: Number, default: 0 },
    emisionesScope2: { type: Number, default: 0 },
    emisionesTotales: { type: Number, default: 0 },
    puntuacion: { type: Number, min: 0, max: 100, default: 0 }
  },
  
  // Paso 3: Gestión del Agua
  agua: {
    consumoTotal: { type: Number, default: 0 },
    tipoMedicion: { 
      type: String, 
      enum: ['persona', 'produccion'], 
      default: 'persona' 
    },
    numeroTrabajadores: { type: Number, default: 0 },
    produccionAnual: { type: Number, default: 0 },
    // Resultados calculados
    consumoPerCapita: { type: Number, default: 0 },
    puntuacion: { type: Number, min: 0, max: 100, default: 0 }
  },
  
  // Paso 4: Gestión de Residuos
  residuos: {
    generados: { type: Number, default: 0 },
    valorizados: { type: Number, default: 0 },
    // Resultados calculados
    porcentajeValorizacion: { type: Number, default: 0 },
    puntuacion: { type: Number, min: 0, max: 100, default: 0 }
  },
  
  // Paso 5: Productos REP
  productosREP: [{
    categoria: { type: String, required: true },
    subCategoria: { type: String, default: '' },
    cantidadGenerada: { type: Number, default: 0 },
    cantidadValorizada: { type: Number, default: 0 }
  }],
  repPuntuacion: { type: Number, min: 0, max: 100, default: 0 },
  
  // Resultados generales
  puntuacionGeneral: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  nivelDesempeno: {
    type: String,
    enum: ['Bajo', 'Básico', 'Intermedio', 'Avanzado'],
    default: 'Bajo'
  },
  
  // Recomendaciones (básicas o completas según plan)
  recomendaciones: {
    type: [String],
    default: []
  },
  tipoRecomendaciones: {
    type: String,
    enum: ['basicas', 'completas'],
    default: 'basicas'
  },
  
  // Estado
  estado: {
    type: String,
    enum: ['borrador', 'completado'],
    default: 'completado'
  },
  notas: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Índices para optimizar búsquedas
diagnosticoSchema.index({ usuario: 1, createdAt: -1 });
diagnosticoSchema.index({ companyName: 'text' });

// Método: Calcular emisiones de carbono
diagnosticoSchema.methods.calcularEmisionesCarbono = function() {
  // Factores de emisión Chile 2023 (kg CO2e por unidad)
  const factores = {
    diesel: 2.68,      // kg CO2e por litro
    bencina: 2.31,     // kg CO2e por litro
    gasNatural: 1.98,  // kg CO2e por m3
    otrosCombustibles: 2.5, // Promedio
    electricidad: 0.413 // kg CO2e por kWh (SEN Chile 2023)
  };
  
  // Scope 1: Combustibles directos
  this.carbono.emisionesScope1 = 
    (this.carbono.diesel * factores.diesel) +
    (this.carbono.bencina * factores.bencina) +
    (this.carbono.gasNatural * factores.gasNatural) +
    (this.carbono.otrosCombustibles * factores.otrosCombustibles);
  
  // Scope 2: Electricidad
  this.carbono.emisionesScope2 = this.carbono.electricidad * factores.electricidad;
  
  // Total
  this.carbono.emisionesTotales = this.carbono.emisionesScope1 + this.carbono.emisionesScope2;
  
  // Puntuación (0-100, donde menos emisiones = mejor puntuación)
  // Benchmark: < 1000 kg = 100, > 10000 kg = 0
  const emisionesTotales = this.carbono.emisionesTotales;
  if (emisionesTotales <= 1000) {
    this.carbono.puntuacion = 100;
  } else if (emisionesTotales >= 10000) {
    this.carbono.puntuacion = 0;
  } else {
    this.carbono.puntuacion = Math.round(100 - ((emisionesTotales - 1000) / 90));
  }
};

// Método: Calcular puntuación de agua
diagnosticoSchema.methods.calcularPuntuacionAgua = function() {
  if (this.agua.tipoMedicion === 'persona' && this.agua.numeroTrabajadores > 0) {
    this.agua.consumoPerCapita = this.agua.consumoTotal / this.agua.numeroTrabajadores;
    
    // Benchmark: < 50 L/persona/día = 100, > 200 L/persona/día = 0
    if (this.agua.consumoPerCapita <= 50) {
      this.agua.puntuacion = 100;
    } else if (this.agua.consumoPerCapita >= 200) {
      this.agua.puntuacion = 0;
    } else {
      this.agua.puntuacion = Math.round(100 - ((this.agua.consumoPerCapita - 50) * 0.67));
    }
  } else {
    // Por defecto si no hay trabajadores
    this.agua.puntuacion = 50;
  }
};

// Método: Calcular puntuación de residuos
diagnosticoSchema.methods.calcularPuntuacionResiduos = function() {
  if (this.residuos.generados > 0) {
    this.residuos.porcentajeValorizacion = 
      (this.residuos.valorizados / this.residuos.generados) * 100;
    
    // Puntuación directa basada en % valorización
    this.residuos.puntuacion = Math.min(100, Math.round(this.residuos.porcentajeValorizacion));
  } else {
    this.residuos.puntuacion = 0;
  }
};

// Método: Calcular puntuación REP
diagnosticoSchema.methods.calcularPuntuacionREP = function() {
  if (this.productosREP.length === 0) {
    this.repPuntuacion = 0;
    return;
  }
  
  let totalGenerado = 0;
  let totalValorizado = 0;
  
  this.productosREP.forEach(producto => {
    totalGenerado += producto.cantidadGenerada;
    totalValorizado += producto.cantidadValorizada;
  });
  
  if (totalGenerado > 0) {
    const porcentaje = (totalValorizado / totalGenerado) * 100;
    this.repPuntuacion = Math.min(100, Math.round(porcentaje));
  } else {
    this.repPuntuacion = 0;
  }
};

// Método: Calcular puntuación general
diagnosticoSchema.methods.calcularPuntuacionGeneral = function() {
  let totalPuntos = 0;
  let dimensionesEvaluadas = 0;
  
  if (this.dimensiones.carbono) {
    this.calcularEmisionesCarbono();
    totalPuntos += this.carbono.puntuacion;
    dimensionesEvaluadas++;
  }
  
  if (this.dimensiones.agua) {
    this.calcularPuntuacionAgua();
    totalPuntos += this.agua.puntuacion;
    dimensionesEvaluadas++;
  }
  
  if (this.dimensiones.residuos) {
    this.calcularPuntuacionResiduos();
    totalPuntos += this.residuos.puntuacion;
    dimensionesEvaluadas++;
  }
  
  if (this.dimensiones.rep) {
    this.calcularPuntuacionREP();
    totalPuntos += this.repPuntuacion;
    dimensionesEvaluadas++;
  }
  
  this.puntuacionGeneral = dimensionesEvaluadas > 0 
    ? Math.round(totalPuntos / dimensionesEvaluadas) 
    : 0;
  
  // Determinar nivel de desempeño
  if (this.puntuacionGeneral >= 80) {
    this.nivelDesempeno = 'Avanzado';
  } else if (this.puntuacionGeneral >= 60) {
    this.nivelDesempeno = 'Intermedio';
  } else if (this.puntuacionGeneral >= 30) {
    this.nivelDesempeno = 'Básico';
  } else {
    this.nivelDesempeno = 'Bajo';
  }
};

// Método: Generar recomendaciones según plan
diagnosticoSchema.methods.generarRecomendaciones = function(planUsuario) {
  const recomendaciones = [];
  
  // Recomendaciones para Huella de Carbono
  if (this.dimensiones.carbono && this.carbono.puntuacion < 60) {
    recomendaciones.push('Implementar un sistema de medición continua de emisiones de GEI');
    if (planUsuario === 'pro') {
      recomendaciones.push('Considerar la certificación de Huella de Carbono bajo la Norma ISO 14064-1');
      recomendaciones.push('Evaluar la transición a energías renovables y vehículos eléctricos');
    }
  }
  
  // Recomendaciones para Agua
  if (this.dimensiones.agua && this.agua.puntuacion < 60) {
    recomendaciones.push('Implementar sistema de medición de consumo de agua por áreas');
    if (planUsuario === 'pro') {
      recomendaciones.push('Instalar sistemas de captación de aguas lluvias para usos no potables');
      recomendaciones.push('Considerar tecnologías de tratamiento y reutilización de aguas grises');
    }
  }
  
  // Recomendaciones para Residuos
  if (this.dimensiones.residuos && this.residuos.puntuacion < 60) {
    recomendaciones.push('Establecer un plan de gestión de residuos con metas de reciclaje');
    if (planUsuario === 'pro') {
      recomendaciones.push('Implementar economía circular en procesos productivos');
      recomendaciones.push('Certificar gestión de residuos bajo Norma Chilena NCh 3250');
    }
  }
  
  // Recomendaciones para REP
  if (this.dimensiones.rep && this.repPuntuacion < 60) {
    recomendaciones.push('Registrarse en el Sistema de Gestión de REP del Ministerio del Medio Ambiente');
    if (planUsuario === 'pro') {
      recomendaciones.push('Establecer convenio con gestor autorizado para productos prioritarios');
      recomendaciones.push('Implementar sistema de trazabilidad de productos bajo Ley REP');
    }
  }
  
  this.recomendaciones = recomendaciones;
  this.tipoRecomendaciones = planUsuario === 'pro' ? 'completas' : 'basicas';
};

module.exports = mongoose.model('Diagnostico', diagnosticoSchema);