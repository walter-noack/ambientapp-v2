// Sistema de recomendaciones personalizadas basado en datos reales

export function generarRecomendacionesCarbono(evaluacion) {
  const recomendaciones = [];
  const { alcance1 = 0, alcance2 = 0 } = evaluacion;
  const total = alcance1 + alcance2;
  
  if (total === 0) {
    return [{
      prioridad: 'alta',
      titulo: 'Establecer línea base de emisiones',
      descripcion: 'Implementar sistema de medición y registro de consumos energéticos',
      impacto: 'Fundamental para gestión futura',
      plazo: 'Inmediato'
    }];
  }

  const porcentajeA1 = (alcance1 / total) * 100;
  const porcentajeA2 = (alcance2 / total) * 100;

  // Recomendaciones según alcance dominante
  if (porcentajeA1 > 60) {
    recomendaciones.push({
      prioridad: 'alta',
      titulo: 'Reducir emisiones de Alcance 1 (combustibles directos)',
      descripcion: `El ${porcentajeA1.toFixed(1)}% de tus emisiones provienen de combustibles directos. Considera electrificar flotas vehiculares, optimizar rutas de transporte o cambiar a combustibles más limpios como GNL o biocombustibles.`,
      impacto: `Reducción potencial: ${(alcance1 * 0.3).toFixed(1)} tCO₂e/año (30%)`,
      plazo: '6-12 meses'
    });

    if (alcance1 > 20) {
      recomendaciones.push({
        prioridad: 'media',
        titulo: 'Programa de conducción eficiente',
        descripcion: 'Capacita a conductores en técnicas de eco-conducción. Instala telemetría para monitorear consumos.',
        impacto: 'Reducción estimada: 10-15% en consumo de combustibles',
        plazo: '3 meses'
      });
    }
  }

  if (porcentajeA2 > 60) {
    recomendaciones.push({
      prioridad: 'alta',
      titulo: 'Migrar a energía renovable',
      descripcion: `El ${porcentajeA2.toFixed(1)}% de tus emisiones provienen de electricidad. Evalúa contratos con generadoras renovables o instalación de paneles solares.`,
      impacto: `Reducción potencial: ${(alcance2 * 0.8).toFixed(1)} tCO₂e/año (80%)`,
      plazo: '12-18 meses'
    });

    recomendaciones.push({
      prioridad: 'media',
      titulo: 'Auditoría energética',
      descripcion: 'Realiza auditoría para identificar equipos ineficientes, fugas de aire comprimido, iluminación obsoleta.',
      impacto: 'Reducción estimada: 15-25% en consumo eléctrico',
      plazo: '1-2 meses'
    });
  }

  // Recomendación general si las emisiones son moderadas
  if (total >= 10 && total <= 50) {
    recomendaciones.push({
      prioridad: 'baja',
      titulo: 'Certificación de huella de carbono',
      descripcion: 'Considera certificar tu inventario de GEI bajo norma ISO 14064 para dar credibilidad externa.',
      impacto: 'Mejora reputacional y acceso a mercados sostenibles',
      plazo: '6 meses'
    });
  }

  return recomendaciones;
}

export function generarRecomendacionesAgua(evaluacion) {
  const recomendaciones = [];
  const consumoTotal = evaluacion.agua?.consumoTotal || 0;
  
  if (consumoTotal === 0) {
    return [{
      prioridad: 'alta',
      titulo: 'Implementar medición de consumo hídrico',
      descripcion: 'Instalar medidores de agua en puntos clave para establecer línea base',
      impacto: 'Base para gestión y reducción futura',
      plazo: 'Inmediato'
    }];
  }

  // Calcular intensidad hídrica
  let intensidad = 0;
  let unidad = '';
  
  if (evaluacion.agua?.tipoMedicion === 'persona') {
    const trabajadores = evaluacion.agua?.numeroTrabajadores || 1;
    intensidad = consumoTotal / trabajadores;
    unidad = 'm³/persona·año';
  } else if (evaluacion.agua?.tipoMedicion === 'produccion') {
    const produccion = evaluacion.agua?.produccionAnual || 1;
    intensidad = consumoTotal / produccion;
    unidad = 'm³/unidad';
  }

  // Recomendaciones según intensidad
  if (evaluacion.agua?.tipoMedicion === 'persona' && intensidad > 50) {
    recomendaciones.push({
      prioridad: 'alta',
      titulo: 'Alto consumo per cápita detectado',
      descripcion: `Tu intensidad hídrica es ${intensidad.toFixed(1)} ${unidad}, por encima del promedio industrial (30-40 m³/persona·año). Prioriza instalación de grifería de bajo flujo, inodoros eficientes y campaña de concientización.`,
      impacto: `Reducción potencial: ${(consumoTotal * 0.25).toFixed(0)} m³/año (25%)`,
      plazo: '3-6 meses'
    });
  }

  if (consumoTotal > 10000) {
    recomendaciones.push({
      prioridad: 'media',
      titulo: 'Sistema de recirculación de agua',
      descripcion: 'Evalúa procesos donde el agua pueda recircularse (torres de enfriamiento, lavado, riego).',
      impacto: 'Reducción estimada: 30-40% en consumo',
      plazo: '6-12 meses'
    });

    recomendaciones.push({
      prioridad: 'media',
      titulo: 'Captura de agua lluvia',
      descripcion: 'Instala sistemas de captación de aguas lluvias para usos no potables.',
      impacto: 'Ahorro estimado: 10-20% del consumo total',
      plazo: '6-9 meses'
    });
  }

  recomendaciones.push({
    prioridad: 'baja',
    titulo: 'Medición en tiempo real',
    descripción: 'Implementa medidores inteligentes con alertas de consumo anormal.',
    impacto: 'Detección temprana de fugas y despilfarros',
    plazo: '3 meses'
  });

  return recomendaciones;
}

export function generarRecomendacionesResiduos(evaluacion) {
  const recomendaciones = [];
  const generados = evaluacion.residuosGenerados || 0;
  const valorizados = evaluacion.residuosValorizados || 0;
  
  if (generados === 0) {
    return [{
      prioridad: 'alta',
      titulo: 'Implementar sistema de pesaje de residuos',
      descripcion: 'Establece método de registro de residuos generados y valorizados',
      impacto: 'Base para gestión y mejora continua',
      plazo: 'Inmediato'
    }];
  }

  const tasaValorizacion = (valorizados / generados) * 100;
  const noValorizados = generados - valorizados;

  if (tasaValorizacion < 30) {
    recomendaciones.push({
      prioridad: 'alta',
      titulo: 'Programa básico de segregación en origen',
      descripcion: `Tu tasa de valorización es solo ${tasaValorizacion.toFixed(1)}%. Implementa estaciones de reciclaje con señalética clara (orgánicos, papel, plástico, vidrio, residuos peligrosos).`,
      impacto: `Potencial de valorizar ${(noValorizados * 0.5).toFixed(0)} kg adicionales/año`,
      plazo: '2-3 meses'
    });

    recomendaciones.push({
      prioridad: 'alta',
      titulo: 'Capacitación de personal',
      descripción: 'Realiza talleres sobre segregación correcta y economía circular.',
      impacto: 'Mejora en tasa de valorización: 20-30 puntos porcentuales',
      plazo: '1 mes'
    });
  } else if (tasaValorizacion >= 30 && tasaValorizacion < 70) {
    recomendaciones.push({
      prioridad: 'media',
      titulo: 'Optimizar cadena de valorización',
      descripción: `Estás valorizando ${tasaValorizacion.toFixed(1)}%. Para llegar a >70%, audita qué residuos aún van a relleno y busca gestores especializados.`,
      impacto: `${(noValorizados * 0.7).toFixed(0)} kg adicionales valorizables/año`,
      plazo: '3-6 meses'
    });

    recomendaciones.push({
      prioridad: 'media',
      titulo: 'Compostaje de orgánicos',
      descripción: 'Si tienes residuos orgánicos, implementa compostaje in-situ o alianza con gestor.',
      impacto: 'Valorización de 100% de orgánicos',
      plazo: '3 meses'
    });
  } else {
    recomendaciones.push({
      prioridad: 'baja',
      titulo: 'Economía circular avanzada',
      descripción: `¡Excelente! Con ${tasaValorizacion.toFixed(1)}% de valorización, ahora explora simbiosis industrial: tus residuos como materia prima de otro.`,
      impacto: 'Valorización cercana al 100%',
      plazo: '12 meses'
    });
  }

  if (generados > 2000) {
    recomendaciones.push({
      prioridad: 'media',
      titulo: 'Reducción en la fuente',
      descripción: 'Más allá de valorizar, reduce generación: envases retornables, compras a granel, productos durables.',
      impacto: `Reducción potencial: ${(generados * 0.15).toFixed(0)} kg/año (15%)`,
      plazo: '6 meses'
    });
  }

  return recomendaciones;
}

export function generarRecomendacionesIntegradas(evaluacion) {
  const carbonRecom = generarRecomendacionesCarbono(evaluacion);
  const aguaRecom = generarRecomendacionesAgua(evaluacion);
  const residuosRecom = generarRecomendacionesResiduos(evaluacion);

  // Combinar todas y ordenar por prioridad
  const todas = [...carbonRecom, ...aguaRecom, ...residuosRecom];
  
  const ordenPrioridad = { 'alta': 1, 'media': 2, 'baja': 3 };
  todas.sort((a, b) => ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad]);

  return todas;
}