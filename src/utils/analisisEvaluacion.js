// src/utils/analisisEvaluacion.js

/**
 * Identifica las fortalezas de la evaluación
 * (áreas con puntaje >= 85)
 */
export function identificarFortalezas(evaluacion) {
  const fortalezas = [];
  const scores = evaluacion?.scores || {};
  
  // CARBONO
  if (scores.carbonScore >= 85) {
    const total = (evaluacion.alcance1 || 0) + (evaluacion.alcance2 || 0);
    fortalezas.push({
      area: 'Huella de Carbono',
      puntaje: scores.carbonScore,
      dato: `${(total / 1000).toFixed(2)} tCO₂e`,
      destaque: 'Emisiones controladas y monitoreadas efectivamente',
      icono: 'Leaf'
    });
  }
  
  // AGUA
  if (scores.waterScore >= 85) {
    const consumo = evaluacion.consumoAgua || 0;
    fortalezas.push({
      area: 'Gestión Hídrica',
      puntaje: scores.waterScore,
      dato: `${consumo.toLocaleString('es-CL')} L/mes`,
      destaque: 'Uso eficiente del recurso hídrico',
      icono: 'Droplet'
    });
  }
  
  // RESIDUOS
  if (scores.wasteScore >= 85) {
    const tasa = evaluacion.residuosGenerados > 0
      ? ((evaluacion.residuosValorizados / evaluacion.residuosGenerados) * 100).toFixed(1)
      : 0;
    fortalezas.push({
      area: 'Gestión de Residuos',
      puntaje: scores.wasteScore,
      dato: `${tasa}% valorización`,
      destaque: 'Alta tasa de valorización de residuos',
      icono: 'Recycle'
    });
  }
  
  // REP - Productos con valorización >= 85%
  const productosREP = evaluacion.productosREP || [];
  productosREP.forEach(producto => {
    const tasaValor = producto.cantidadGenerada > 0
      ? (producto.cantidadValorizada / producto.cantidadGenerada) * 100
      : 0;
    
    if (tasaValor >= 85) {
      fortalezas.push({
        area: `REP: ${producto.producto}`,
        puntaje: Math.round(tasaValor),
        dato: `${producto.cantidadValorizada.toLocaleString('es-CL')} / ${producto.cantidadGenerada.toLocaleString('es-CL')} kg`,
        destaque: 'Cumple y supera meta de valorización',
        icono: 'Award'
      });
    }
  });
  
  return fortalezas;
}

/**
 * Identifica oportunidades de mejora
 * (áreas con puntaje < 70 o gaps significativos)
 */
export function identificarOportunidades(evaluacion) {
  const oportunidades = [];
  const scores = evaluacion?.scores || {};
  
  // CARBONO
  if (scores.carbonScore < 70) {
    const alcance1 = evaluacion.alcance1 || 0;
    const alcance2 = evaluacion.alcance2 || 0;
    const total = alcance1 + alcance2;
    const mayorAlcance = alcance1 > alcance2 ? 'combustibles (Alcance 1)' : 'electricidad (Alcance 2)';
    const porcentajeMayor = alcance1 > alcance2 
      ? ((alcance1 / total) * 100).toFixed(1)
      : ((alcance2 / total) * 100).toFixed(1);
    
    oportunidades.push({
      area: 'Huella de Carbono',
      puntaje: scores.carbonScore,
      gap: `${100 - scores.carbonScore} puntos por debajo del nivel óptimo`,
      causa: `${porcentajeMayor}% de emisiones provienen de ${mayorAlcance}`,
      accionClave: alcance1 > alcance2 
        ? 'Optimizar uso de combustibles y flotas'
        : 'Mejorar eficiencia energética',
      icono: 'AlertTriangle'
    });
  }
  
  // AGUA
  if (scores.waterScore < 70) {
    const consumo = evaluacion.consumoAgua || 0;
    const intensidad = evaluacion.intensidadHidrica?.valor || 0;
    
    oportunidades.push({
      area: 'Gestión Hídrica',
      puntaje: scores.waterScore,
      gap: `${100 - scores.waterScore} puntos por debajo del nivel óptimo`,
      causa: intensidad > 100 ? 'Alta intensidad hídrica por unidad' : 'Consumo elevado sin reutilización',
      accionClave: 'Implementar sistemas de recirculación de agua',
      icono: 'Droplet'
    });
  }
  
  // RESIDUOS
  if (scores.wasteScore < 70) {
    const tasa = evaluacion.residuosGenerados > 0
      ? ((evaluacion.residuosValorizados / evaluacion.residuosGenerados) * 100).toFixed(1)
      : 0;
    
    oportunidades.push({
      area: 'Gestión de Residuos',
      puntaje: scores.wasteScore,
      gap: `Solo ${tasa}% de valorización`,
      causa: 'Baja segregación en origen o falta de convenios',
      accionClave: 'Implementar programa de separación en origen',
      icono: 'Trash2'
    });
  }
  
  // REP - Productos bajo meta
  const productosREP = evaluacion.productosREP || [];
  productosREP.forEach(producto => {
    const tasaValor = producto.cantidadGenerada > 0
      ? (producto.cantidadValorizada / producto.cantidadGenerada) * 100
      : 0;
    
    // Metas simplificadas (se puede mejorar con metasREP.js)
    const meta = 50;
    
    if (tasaValor < meta) {
      oportunidades.push({
        area: `REP: ${producto.producto}`,
        puntaje: Math.round(tasaValor),
        gap: `${(meta - tasaValor).toFixed(1)}% por debajo de meta`,
        causa: 'Incumplimiento de obligaciones REP',
        accionClave: 'Adherirse a sistema de gestión colectivo',
        icono: 'AlertCircle'
      });
    }
  });
  
  return oportunidades;
}

/**
 * Genera recomendaciones priorizadas basadas en el análisis
 */
export function generarRecomendacionesPriorizadas(evaluacion) {
  const recomendaciones = [];
  const scores = evaluacion?.scores || {};
  const alcance1 = evaluacion.alcance1 || 0;
  const alcance2 = evaluacion.alcance2 || 0;
  
  // RECOMENDACIÓN 1: Eficiencia energética (si Alcance 2 es alto)
  if (alcance2 > alcance1 * 0.4) {
    const porcentajeA2 = ((alcance2 / (alcance1 + alcance2)) * 100).toFixed(1);
    recomendaciones.push({
      id: 1,
      titulo: 'Optimizar consumo energético',
      categoria: 'Carbono',
      prioridad: 'Alta',
      impacto: 'Alto',
      esfuerzo: 'Medio',
      roi: '20% reducción emisiones en 12 meses',
      vinculo: {
        problema: `Alcance 2 representa ${porcentajeA2}% de emisiones totales`,
        oportunidad: 'Auditoría energética puede identificar 20-30% desperdicio'
      },
      pasos: [
        'Contratar auditoría energética certificada',
        'Instalar medidores inteligentes en áreas críticas',
        'Implementar plan de mantenimiento preventivo',
        'Capacitar equipo en buenas prácticas energéticas'
      ],
      recursos: {
        presupuesto: '$3.000.000 - $5.000.000',
        tiempo: '3-6 meses',
        equipo: 'Jefe de Operaciones + Técnico de Mantención'
      },
      kpis: [
        'kWh/mes consumidos',
        'Costo energético mensual',
        'Toneladas CO₂e reducidas'
      ],
      impactoNumerico: 9,
      esfuerzoNumerico: 5
    });
  }
  
  // RECOMENDACIÓN 2: Separación de residuos
  const tasaValor = evaluacion.residuosGenerados > 0
    ? (evaluacion.residuosValorizados / evaluacion.residuosGenerados) * 100
    : 0;
  
  if (tasaValor < 75) {
    recomendaciones.push({
      id: 2,
      titulo: 'Implementar programa de segregación en origen',
      categoria: 'Residuos',
      prioridad: tasaValor < 50 ? 'Alta' : 'Media',
      impacto: 'Alto',
      esfuerzo: 'Bajo',
      roi: 'Aumento de 30% en valorización en 6 meses',
      vinculo: {
        problema: `Solo ${tasaValor.toFixed(1)}% de residuos actualmente valorizados`,
        oportunidad: 'Separación adecuada puede alcanzar 80-90% valorización'
      },
      pasos: [
        'Caracterizar residuos por área/proceso',
        'Instalar estaciones de reciclaje señalizadas',
        'Capacitar personal en segregación correcta',
        'Establecer convenios con gestores autorizados'
      ],
      recursos: {
        presupuesto: '$800.000 - $1.500.000',
        tiempo: '2-4 meses',
        equipo: 'Encargado Ambiental + RRHH'
      },
      kpis: [
        '% Valorización mensual',
        'kg residuos por categoría',
        'Costo gestión por kg'
      ],
      impactoNumerico: 8,
      esfuerzoNumerico: 3
    });
  }
  
  // RECOMENDACIÓN 3: Sistema de gestión ISO 14001
  if (scores.carbonScore < 75 || scores.waterScore < 75 || scores.wasteScore < 75) {
    recomendaciones.push({
      id: 3,
      titulo: 'Certificar Sistema de Gestión Ambiental ISO 14001',
      categoria: 'Gestión',
      prioridad: 'Media',
      impacto: 'Alto',
      esfuerzo: 'Alto',
      roi: 'Mejora integral en 18-24 meses',
      vinculo: {
        problema: 'Falta de marco estructurado para gestión ambiental',
        oportunidad: 'ISO 14001 mejora desempeño y reduce riesgos legales'
      },
      pasos: [
        'Realizar diagnóstico de brechas vs ISO 14001',
        'Designar representante de dirección',
        'Documentar política y procedimientos ambientales',
        'Implementar auditorías internas',
        'Solicitar certificación con organismo acreditado'
      ],
      recursos: {
        presupuesto: '$8.000.000 - $15.000.000',
        tiempo: '12-18 meses',
        equipo: 'Gerencia + Equipo multidisciplinario'
      },
      kpis: [
        'No conformidades cerradas',
        'Aspectos ambientales controlados',
        'Incidentes ambientales'
      ],
      impactoNumerico: 9,
      esfuerzoNumerico: 8
    });
  }
  
  // RECOMENDACIÓN 4: Cumplimiento REP
  const productosREP = evaluacion.productosREP || [];
  const productosBajoMeta = productosREP.filter(p => {
    const tasa = p.cantidadGenerada > 0 ? (p.cantidadValorizada / p.cantidadGenerada) * 100 : 0;
    return tasa < 50;
  });
  
  if (productosBajoMeta.length > 0) {
    recomendaciones.push({
      id: 4,
      titulo: 'Adherirse a Sistema de Gestión Colectivo REP',
      categoria: 'Cumplimiento',
      prioridad: 'Alta',
      impacto: 'Alto',
      esfuerzo: 'Bajo',
      roi: 'Cumplimiento legal inmediato',
      vinculo: {
        problema: `${productosBajoMeta.length} producto(s) bajo meta de valorización`,
        oportunidad: 'Sistemas colectivos facilitan cumplimiento y reducen costos'
      },
      pasos: [
        'Identificar sistemas colectivos autorizados',
        'Evaluar costos y condiciones de adhesión',
        'Formalizar inscripción ante sistema',
        'Reportar cantidades según cronograma',
        'Mantener registros para fiscalización'
      ],
      recursos: {
        presupuesto: '$500.000 - $2.000.000/año',
        tiempo: '1-2 meses',
        equipo: 'Encargado Legal/Ambiental'
      },
      kpis: [
        '% Cumplimiento metas REP',
        'Declaraciones presentadas a tiempo',
        'Multas o sanciones evitadas'
      ],
      impactoNumerico: 9,
      esfuerzoNumerico: 2
    });
  }
  
  // RECOMENDACIÓN 5: Economía circular avanzada
  if (tasaValor >= 70) {
    recomendaciones.push({
      id: 5,
      titulo: 'Implementar programa de economía circular avanzada',
      categoria: 'Innovación',
      prioridad: 'Media',
      impacto: 'Medio',
      esfuerzo: 'Alto',
      roi: 'Valorización cercana al 100% en 24 meses',
      vinculo: {
        problema: 'Oportunidad de cerrar ciclos y eliminar residuos',
        oportunidad: 'Convertir residuos en insumos o nuevos productos'
      },
      pasos: [
        'Mapear flujos de materiales y residuos',
        'Identificar simbiosis industrial potencial',
        'Diseñar productos para reciclabilidad',
        'Establecer alianzas con recicladores',
        'Comunicar compromiso circular'
      ],
      recursos: {
        presupuesto: '$10.000.000 - $20.000.000',
        tiempo: '18-24 meses',
        equipo: 'Gerencia + I+D + Operaciones'
      },
      kpis: [
        '% Material en circuito cerrado',
        'Nuevos productos de material reciclado',
        'Reducción consumo materias primas'
      ],
      impactoNumerico: 7,
      esfuerzoNumerico: 8
    });
  }
  
  // Ordenar por prioridad (impacto vs esfuerzo)
  return recomendaciones.sort((a, b) => {
    // Score = impacto / esfuerzo (mayor es mejor)
    const scoreA = a.impactoNumerico / a.esfuerzoNumerico;
    const scoreB = b.impactoNumerico / b.esfuerzoNumerico;
    return scoreB - scoreA;
  });
}

/**
 * Genera el roadmap trimestral
 */
export function generarRoadmap(recomendaciones) {
  const altaPrioridad = recomendaciones.filter(r => r.prioridad === 'Alta');
  const mediaPrioridad = recomendaciones.filter(r => r.prioridad === 'Media');
  
  return [
    {
      trimestre: 'Q1 2025',
      mes: 'Ene-Mar',
      acciones: altaPrioridad.slice(0, 2).map(r => r.titulo)
    },
    {
      trimestre: 'Q2 2025',
      mes: 'Abr-Jun',
      acciones: [
        ...altaPrioridad.slice(2, 3).map(r => r.titulo),
        ...mediaPrioridad.slice(0, 1).map(r => r.titulo)
      ]
    },
    {
      trimestre: 'Q3 2025',
      mes: 'Jul-Sep',
      acciones: mediaPrioridad.slice(1, 3).map(r => r.titulo)
    },
    {
      trimestre: 'Q4 2025',
      mes: 'Oct-Dic',
      acciones: ['Revisión anual de cumplimiento', 'Preparar nueva evaluación']
    }
  ].filter(q => q.acciones.length > 0);
}

/**
 * Identifica Quick Wins (impacto alto, esfuerzo bajo)
 */
export function identificarQuickWins(recomendaciones) {
  return recomendaciones.filter(r => 
    r.impactoNumerico >= 7 && r.esfuerzoNumerico <= 4
  );
}