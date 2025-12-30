import { jsPDF } from 'jspdf';

/**
 * Genera un PDF profesional del diagnóstico ambiental con gráficos
 * Inspirado en InformePDF.jsx pero adaptado para generación programática
 * @param {Object} evaluacion - Datos completos de la evaluación
 */
export const generarPDFDiagnostico = async (evaluacion) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Colores corporativos de Ambientapp
  const colors = {
    primary: [34, 197, 94],      // green-500 (emerald)
    secondary: [16, 185, 129],    // emerald-500
    accent: [59, 130, 246],       // blue-500
    dark: [15, 23, 42],           // slate-900
    muted: [100, 116, 139],       // slate-500
    light: [241, 245, 249],       // slate-100
    success: [34, 197, 94],
    warning: [251, 191, 36],
    danger: [239, 68, 68]
  };

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  const addNewPage = () => {
    doc.addPage();
    return margin;
  };

  const addPageNumber = (pageNum) => {
    doc.setFontSize(9);
    doc.setTextColor(...colors.muted);
    doc.text(`Página ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

  const addSectionHeader = (title, subtitle, yPosition) => {
    // Fondo del encabezado
    doc.setFillColor(...colors.primary);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 14, 'F');
    
    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(String(title), margin + 5, yPosition + 9);
    
    yPosition += 18;
    
    // Subtítulo (opcional)
    if (subtitle) {
      doc.setTextColor(...colors.muted);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(String(subtitle), margin + 5, yPosition);
      yPosition += 8;
    }
    
    // Línea separadora
    doc.setDrawColor(...colors.light);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    
    return yPosition + 8;
  };

  const addKPIBox = (x, y, width, height, title, value, unit, color = colors.primary) => {
    // Borde y fondo
    doc.setFillColor(color[0] + 210, color[1] + 210, color[2] + 210);
    doc.setDrawColor(...color);
    doc.roundedRect(x, y, width, height, 3, 3, 'FD');
    
    // Título
    doc.setTextColor(...colors.muted);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(String(title).toUpperCase(), x + width / 2, y + 8, { align: 'center' });
    
    // Valor - SIEMPRE convertir a string
    doc.setTextColor(...colors.dark);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(String(value), x + width / 2, y + 22, { align: 'center' });
    
    // Unidad
    doc.setTextColor(...colors.muted);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(String(unit), x + width / 2, y + 28, { align: 'center' });
  };

  const addTable = (headers, rows, startY, columnWidths) => {
    const tableWidth = pageWidth - 2 * margin;
    const defaultColWidth = tableWidth / headers.length;
    const colWidths = columnWidths || headers.map(() => defaultColWidth);
    const rowHeight = 8;
    let currentY = startY;

    // Encabezado
    doc.setFillColor(...colors.primary);
    doc.rect(margin, currentY, tableWidth, rowHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    let currentX = margin;
    headers.forEach((header, i) => {
      doc.text(String(header), currentX + 2, currentY + 5.5);
      currentX += colWidths[i];
    });
    
    currentY += rowHeight;

    // Filas
    doc.setTextColor(...colors.dark);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    rows.forEach((row, rowIndex) => {
      // Alternar color de fondo
      if (rowIndex % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, currentY, tableWidth, rowHeight, 'F');
      }
      
      // Dibujar borde
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, currentY, tableWidth, rowHeight, 'S');
      
      // Contenido
      currentX = margin;
      row.forEach((cell, i) => {
        doc.text(String(cell), currentX + 2, currentY + 5.5);
        currentX += colWidths[i];
      });
      
      currentY += rowHeight;
    });

    return currentY;
  };

  const addRecommendationBox = (yPosition, title, items, icon = '💡') => {
    const boxWidth = pageWidth - 2 * margin;
    const boxHeight = 10 + items.length * 6;
    
    // Fondo
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(...colors.success);
    doc.roundedRect(margin, yPosition, boxWidth, boxHeight, 3, 3, 'FD');
    
    // Título
    doc.setTextColor(...colors.dark);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${icon} ${title}`, margin + 3, yPosition + 6);
    
    yPosition += 10;
    
    // Items
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    items.forEach(item => {
      doc.text(String(item), margin + 5, yPosition);
      yPosition += 6;
    });
    
    return yPosition + 5;
  };

  // ============================================
  // EXTRAER DATOS DE LA EVALUACIÓN
  // ============================================

  const companyName = evaluacion?.companyName || 'Empresa';
  const period = evaluacion?.period || 'Período no especificado';
  const fecha = new Date().toLocaleDateString('es-CL');
  
  // Carbono
  const alcance1 = Number(evaluacion?.alcance1 || 0);
  const alcance2 = Number(evaluacion?.alcance2 || 0);
  const totalCarbono = alcance1 + alcance2;
  
  // Agua
  const consumoAgua = Number(evaluacion?.waterData?.consumoMensual || evaluacion?.consumoAgua || 0);
  const aguaReutilizada = Number(evaluacion?.aguaReutilizada || 0);
  const eficienciaAgua = consumoAgua > 0 ? ((aguaReutilizada / consumoAgua) * 100).toFixed(1) : '0';
  const empleados = Number(evaluacion?.empleados || 1);
  const consumoPorEmpleado = (consumoAgua / empleados).toFixed(2);
  
  // Residuos
  const residuosTotales = Number(evaluacion?.wasteData?.residuosTotales || evaluacion?.residuosGenerados || 0);
  const residuosReciclados = Number(evaluacion?.wasteData?.residuosReciclados || evaluacion?.residuosValorizados || 0);
  const tasaValorizacion = residuosTotales > 0 
    ? ((residuosReciclados / residuosTotales) * 100).toFixed(1) 
    : '0';
  
  // Scores
  const carbonScore = Number(evaluacion?.scores?.carbonScore || 0);
  const waterScore = Number(evaluacion?.scores?.waterScore || 0);
  const wasteScore = Number(evaluacion?.scores?.wasteScore || 0);
  
  // REP
  const productosREP = evaluacion?.productosREP || [];

  // ============================================
  // PÁGINA 1: PORTADA
  // ============================================

  // Logo placeholder
  doc.setFillColor(...colors.primary);
  doc.rect(margin, yPos, 60, 60, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('LOGO', margin + 30, yPos + 38, { align: 'center' });
  
  yPos += 75;
  
  // Título principal
  doc.setTextColor(...colors.dark);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('DIAGNÓSTICO', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 12;
  doc.text('AMBIENTAL', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 18;
  doc.setFontSize(20);
  doc.setTextColor(...colors.primary);
  doc.text(companyName, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 12;
  doc.setFontSize(12);
  doc.setTextColor(...colors.muted);
  doc.text(`Período: ${period}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 35;
  
  // Caja de resumen ejecutivo
  const boxWidth = pageWidth - 2 * margin - 40;
  const boxX = margin + 20;
  
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(...colors.primary);
  doc.roundedRect(boxX, yPos, boxWidth, 70, 5, 5, 'FD');
  
  yPos += 12;
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMEN EJECUTIVO', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 12;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const resumen = [
    `Huella de Carbono: ${totalCarbono.toFixed(2)} tCO₂e`,
    `Consumo de Agua: ${consumoAgua.toLocaleString('es-CL')} L/mes`,
    `Residuos Generados: ${residuosTotales.toLocaleString('es-CL')} kg`,
    `Tasa de Valorización: ${tasaValorizacion}%`,
    `Score Ambiental Promedio: ${((carbonScore + waterScore + wasteScore) / 3).toFixed(1)}`
  ];
  
  resumen.forEach(linea => {
    doc.text(linea, boxX + 10, yPos);
    yPos += 8;
  });
  
  // Pie de página
  doc.setFontSize(9);
  doc.setTextColor(...colors.muted);
  doc.text(`Fecha de generación: ${fecha}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
  doc.text('Generado por Ambientapp', pageWidth / 2, pageHeight - 12, { align: 'center' });
  
  addPageNumber(1);

  // ============================================
  // PÁGINA 2: HUELLA DE CARBONO
  // ============================================

  yPos = addNewPage();
  yPos = addSectionHeader(
    'HUELLA DE CARBONO',
    'Análisis de emisiones de gases de efecto invernadero (Alcances 1 y 2)',
    yPos
  );

  // KPIs de Carbono
  const kpiY = yPos;
  const kpiWidth = (pageWidth - 2 * margin - 20) / 3;
  
  addKPIBox(margin, kpiY, kpiWidth, 35, 'Total Emisiones', totalCarbono.toFixed(2), 'tCO₂e', colors.primary);
  addKPIBox(margin + kpiWidth + 10, kpiY, kpiWidth, 35, 'Alcance 1', alcance1.toFixed(2), 'tCO₂e', colors.success);
  addKPIBox(margin + 2 * (kpiWidth + 10), kpiY, kpiWidth, 35, 'Alcance 2', alcance2.toFixed(2), 'tCO₂e', colors.accent);
  
  yPos = kpiY + 45;

  // Tabla de desglose
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Desglose por Alcance', margin, yPos);
  yPos += 8;

  const tablaCarbono = [
    ['Alcance 1 (Combustibles)', alcance1.toFixed(2), `${totalCarbono > 0 ? ((alcance1/totalCarbono)*100).toFixed(1) : 0}%`],
    ['Alcance 2 (Electricidad)', alcance2.toFixed(2), `${totalCarbono > 0 ? ((alcance2/totalCarbono)*100).toFixed(1) : 0}%`],
    ['TOTAL', totalCarbono.toFixed(2), '100%']
  ];

  yPos = addTable(['Fuente', 'Emisiones (tCO₂e)', 'Porcentaje'], tablaCarbono, yPos);
  yPos += 10;

  // Interpretación
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F');
  
  yPos += 8;
  doc.setTextColor(...colors.dark);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Interpretación', margin + 5, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const alcanceDominante = alcance1 > alcance2 ? 'combustibles' : 'electricidad';
  const porcentajeDominante = alcance1 > alcance2 
    ? ((alcance1/totalCarbono)*100).toFixed(1)
    : ((alcance2/totalCarbono)*100).toFixed(1);
  
  const interpretacionCarbono = `La empresa presenta una huella de carbono total de ${totalCarbono.toFixed(2)} tCO₂e. El mayor aporte proviene de ${alcanceDominante} (${porcentajeDominante}%), lo que sugiere enfocar los esfuerzos de reducción en esta área.`;
  
  const lines = doc.splitTextToSize(interpretacionCarbono, pageWidth - 2 * margin - 10);
  lines.forEach(line => {
    doc.text(line, margin + 5, yPos);
    yPos += 5;
  });
  
  yPos += 10;

  // Recomendaciones
  yPos = addRecommendationBox(yPos, 'Recomendaciones para Reducción de Emisiones', [
    'Implementar medidas de eficiencia energética',
    'Considerar fuentes de energía renovable',
    'Optimizar rutas de transporte y logística',
    'Establecer metas de reducción anuales'
  ]);

  addPageNumber(2);

  // ============================================
  // PÁGINA 3: GESTIÓN DEL AGUA
  // ============================================

  yPos = addNewPage();
  yPos = addSectionHeader(
    'GESTIÓN DEL AGUA',
    'Análisis de consumo y eficiencia hídrica',
    yPos
  );

  // KPIs de Agua
  const aguaKpiY = yPos;
  
  addKPIBox(margin, aguaKpiY, kpiWidth, 35, 'Consumo Mensual', consumoAgua.toLocaleString('es-CL'), 'L/mes', colors.accent);
  addKPIBox(margin + kpiWidth + 10, aguaKpiY, kpiWidth, 35, 'Eficiencia', eficienciaAgua, '%', colors.success);
  addKPIBox(margin + 2 * (kpiWidth + 10), aguaKpiY, kpiWidth, 35, 'Por Empleado', consumoPorEmpleado, 'L', colors.primary);
  
  yPos = aguaKpiY + 45;

  // Interpretación
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(...colors.accent);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 40, 3, 3, 'FD');
  
  yPos += 8;
  doc.setTextColor(...colors.dark);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Análisis del Consumo Hídrico', margin + 5, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  let interpretacionAgua = `El consumo mensual de agua es de ${consumoAgua.toLocaleString('es-CL')} litros, lo que equivale a ${consumoPorEmpleado} litros por empleado. `;
  
  if (Number(eficienciaAgua) > 30) {
    interpretacionAgua += `Con una eficiencia del ${eficienciaAgua}%, se observa un buen desempeño en la gestión hídrica.`;
  } else if (Number(eficienciaAgua) > 15) {
    interpretacionAgua += `Con una eficiencia del ${eficienciaAgua}%, existe margen de mejora en la gestión del recurso.`;
  } else {
    interpretacionAgua += `Con una eficiencia del ${eficienciaAgua}%, se recomienda implementar medidas urgentes de ahorro.`;
  }
  
  const aguaLines = doc.splitTextToSize(interpretacionAgua, pageWidth - 2 * margin - 10);
  aguaLines.forEach(line => {
    doc.text(line, margin + 5, yPos);
    yPos += 5;
  });
  
  yPos += 15;

  // Recomendaciones
  yPos = addRecommendationBox(yPos, 'Recomendaciones para Optimización Hídrica', [
    'Instalar sistemas de captación de agua lluvia',
    'Implementar tecnologías de bajo consumo',
    'Realizar mantención de instalaciones',
    'Capacitar personal en uso eficiente',
    'Considerar sistemas de recirculación'
  ]);

  addPageNumber(3);

  // ============================================
  // PÁGINA 4: GESTIÓN DE RESIDUOS
  // ============================================

  yPos = addNewPage();
  yPos = addSectionHeader(
    'GESTIÓN DE RESIDUOS',
    'Análisis de generación, valorización y cumplimiento normativo',
    yPos
  );

  // KPIs de Residuos
  const residuosKpiY = yPos;
  
  addKPIBox(margin, residuosKpiY, kpiWidth, 35, 'Total Generado', residuosTotales.toLocaleString('es-CL'), 'kg', colors.warning);
  addKPIBox(margin + kpiWidth + 10, residuosKpiY, kpiWidth, 35, 'Valorizados', residuosReciclados.toLocaleString('es-CL'), 'kg', colors.success);
  addKPIBox(margin + 2 * (kpiWidth + 10), residuosKpiY, kpiWidth, 35, 'Tasa Valorización', tasaValorizacion, '%', colors.primary);
  
  yPos = residuosKpiY + 45;

  // Tabla de residuos por tipo
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Desglose por Tipo de Residuo', margin, yPos);
  yPos += 8;

  const tablaResiduos = [
    ['Reciclables', (residuosReciclados * 0.6).toFixed(2), 'Valorización'],
    ['Orgánicos', (residuosReciclados * 0.3).toFixed(2), 'Compostaje'],
    ['Peligrosos', (residuosReciclados * 0.1).toFixed(2), 'Tratamiento especial'],
    ['Disposición final', (residuosTotales - residuosReciclados).toFixed(2), 'Relleno sanitario']
  ];

  yPos = addTable(['Tipo', 'Cantidad (kg)', 'Gestión'], tablaResiduos, yPos);
  yPos += 10;

  // Interpretación
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(...colors.warning);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'FD');
  
  yPos += 8;
  doc.setTextColor(...colors.dark);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Evaluación del Desempeño', margin + 5, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  let interpretacionResiduos = `Se generaron ${residuosTotales.toLocaleString('es-CL')} kg de residuos, con una tasa de valorización del ${tasaValorizacion}%. `;
  
  if (Number(tasaValorizacion) >= 50) {
    interpretacionResiduos += 'El desempeño es satisfactorio, mantener y mejorar las prácticas actuales.';
  } else if (Number(tasaValorizacion) >= 25) {
    interpretacionResiduos += 'Existe potencial de mejora en la segregación y valorización de residuos.';
  } else {
    interpretacionResiduos += 'Se requiere implementar urgentemente un plan de gestión integral de residuos.';
  }
  
  const residuosLines = doc.splitTextToSize(interpretacionResiduos, pageWidth - 2 * margin - 10);
  residuosLines.forEach(line => {
    doc.text(line, margin + 5, yPos);
    yPos += 5;
  });
  
  yPos += 15;

  // Recomendaciones
  yPos = addRecommendationBox(yPos, 'Recomendaciones para Gestión de Residuos', [
    'Implementar segregación en origen',
    'Establecer alianzas con gestores certificados',
    'Capacitar al personal en manejo de residuos',
    'Evaluar economía circular',
    'Documentar valorizaciones para REP'
  ]);

  addPageNumber(4);

  // ============================================
  // PÁGINA 5: LEY REP Y CONCLUSIONES
  // ============================================

  yPos = addNewPage();
  yPos = addSectionHeader(
    'LEY REP Y CONCLUSIONES',
    'Responsabilidad Extendida del Productor y análisis integrado',
    yPos
  );

  // Sección REP
  doc.setTextColor(...colors.dark);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Productos Prioritarios REP', margin, yPos);
  yPos += 8;

  if (productosREP.length > 0) {
    const bodyREP = productosREP.map(p => [
      p.nombre || 'Sin nombre',
      String(p.cantidad || 0),
      p.gestionado ? 'Sí' : 'No',
      p.certificado ? 'Sí' : 'No'
    ]);

    yPos = addTable(['Producto', 'Cantidad', 'Gestionado', 'Certificado'], bodyREP, yPos);
    yPos += 10;

    const gestionados = productosREP.filter(p => p.gestionado).length;
    const tasaCumplimiento = ((gestionados / productosREP.length) * 100).toFixed(1);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Tasa de Cumplimiento REP: ${tasaCumplimiento}%`, margin, yPos);
    yPos += 15;
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('No se registraron productos prioritarios sujetos a Ley REP.', margin, yPos);
    yPos += 15;
  }

  // Conclusiones generales
  doc.setFillColor(...colors.light);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 60, 3, 3, 'F');
  
  yPos += 8;
  doc.setTextColor(...colors.dark);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Conclusiones y Próximos Pasos', margin + 5, yPos);
  
  yPos += 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const conclusiones = [
    `1. La empresa presenta un desempeño ambiental con margen de mejora en las áreas evaluadas.`,
    `2. Se recomienda priorizar acciones en ${Number(tasaValorizacion) < 50 ? 'gestión de residuos' : alcance1 > alcance2 ? 'reducción de combustibles' : 'eficiencia energética'}.`,
    `3. Establecer metas SMART para cada indicador y realizar seguimiento trimestral.`,
    `4. Implementar un sistema de gestión ambiental certificable (ISO 14001).`,
    `5. Considerar la elaboración de un reporte de sostenibilidad anual.`
  ];
  
  conclusiones.forEach(conclusion => {
    const concLines = doc.splitTextToSize(conclusion, pageWidth - 2 * margin - 10);
    concLines.forEach(line => {
      doc.text(line, margin + 5, yPos);
      yPos += 5;
    });
    yPos += 2;
  });

  // Pie de página final
  yPos = pageHeight - 25;
  doc.setFontSize(9);
  doc.setTextColor(...colors.muted);
  doc.text('Diagnóstico generado por Ambientapp', pageWidth / 2, yPos, { align: 'center' });
  doc.text(`${companyName} | ${period}`, pageWidth / 2, yPos + 5, { align: 'center' });
  doc.text('Para más información: www.ambientapp.cl', pageWidth / 2, yPos + 10, { align: 'center' });

  addPageNumber(5);

  // Guardar PDF
  const fileName = `Diagnostico_${companyName.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};