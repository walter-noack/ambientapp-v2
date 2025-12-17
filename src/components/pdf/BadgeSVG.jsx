// src/components/pdf/BadgeSVG.jsx
// Badges rectangulares usando SVG para centrado perfecto en html2pdf

import React from 'react';

/**
 * Badge rectangular con SVG
 * Funciona perfectamente en html2pdf
 */
export function BadgeSVG({ 
  texto, 
  width = 80,           // Ancho en px
  height = 24,          // Alto en px
  bgColor = '#dc2626',  // Color de fondo (hex)
  textColor = '#ffffff', // Color del texto (hex)
  fontSize = 10,        // Tamaño de fuente en px
  borderRadius = 4,     // Radio de esquinas
  fontWeight = 'bold'   // 'normal', 'bold', 'semibold'
}) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Rectángulo con esquinas redondeadas */}
      <rect 
        x="0" 
        y="0" 
        width={width} 
        height={height} 
        rx={borderRadius}
        ry={borderRadius}
        fill={bgColor}
      />
      
      {/* Texto centrado */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill={textColor}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {texto}
      </text>
    </svg>
  );
}

/**
 * Badge con borde (para KPIs)
 */
export function BadgeSVGConBorde({ 
  texto, 
  width = 120,
  height = 24,
  bgColor = '#ffffff',
  textColor = '#475569',
  borderColor = '#cbd5e1',
  fontSize = 9,
  borderRadius = 4
}) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Rectángulo de fondo */}
      <rect 
        x="0" 
        y="0" 
        width={width} 
        height={height} 
        rx={borderRadius}
        ry={borderRadius}
        fill={bgColor}
        stroke={borderColor}
        strokeWidth="1"
      />
      
      {/* Texto centrado */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill={textColor}
        fontSize={fontSize}
        fontWeight="normal"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {texto}
      </text>
    </svg>
  );
}

/**
 * Badge de puntaje (85/100, 40/100)
 */
export function BadgePuntajeSVG({ 
  puntaje,
  bgColor = '#059669',  // emerald-600 por defecto
  width = 60,
  height = 24
}) {
  return (
    <BadgeSVG
      texto={`${puntaje}/100`}
      width={width}
      height={height}
      bgColor={bgColor}
      textColor="#ffffff"
      fontSize={10}
      fontWeight="bold"
      borderRadius={4}
    />
  );
}

/**
 * Badge de prioridad (Alta, Media, Baja)
 */
export function BadgePrioridadSVG({ 
  prioridad,
  width = 50,
  height = 20
}) {
  const colores = {
    'Alta': '#dc2626',      // red-600
    'Media': '#ca8a04',     // yellow-600
    'Baja': '#16a34a'       // green-600
  };
  
  return (
    <BadgeSVG
      texto={prioridad}
      width={width}
      height={height}
      bgColor={colores[prioridad] || '#ca8a04'}
      textColor="#ffffff"
      fontSize={9}
      fontWeight="600"
      borderRadius={3}
    />
  );
}

/**
 * Badge de categoría/atributo (Carbono, Impacto: Alto, etc.)
 */
export function BadgeAtributoSVG({ 
  texto,
  bgColor = '#e2e8f0',    // slate-200
  textColor = '#334155',  // slate-700
  width,                  // auto-calculado si no se especifica
  height = 20
}) {
  // Calcular ancho aproximado basado en longitud de texto
  const calculatedWidth = width || (texto.length * 6 + 16);
  
  return (
    <BadgeSVG
      texto={texto}
      width={calculatedWidth}
      height={height}
      bgColor={bgColor}
      textColor={textColor}
      fontSize={9}
      fontWeight="600"
      borderRadius={3}
    />
  );
}

/**
 * Badge de KPI (para la lista de KPIs)
 */
export function BadgeKPISVG({ texto }) {
  const width = texto.length * 6 + 16;
  
  return (
    <BadgeSVGConBorde
      texto={texto}
      width={width}
      height={20}
      bgColor="#ffffff"
      textColor="#475569"
      borderColor="#cbd5e1"
      fontSize={9}
      borderRadius={3}
    />
  );
}

/**
 * Mapeo de colores para badges de atributo
 */
export const COLORES_BADGE = {
  // Impacto
  'Impacto: Alto': { bg: '#dbeafe', text: '#1e40af' },    // blue-100/blue-800
  'Impacto: Medio': { bg: '#dbeafe', text: '#1e40af' },
  'Impacto: Bajo': { bg: '#dbeafe', text: '#1e40af' },
  
  // Esfuerzo
  'Esfuerzo: Alto': { bg: '#f3e8ff', text: '#6b21a8' },   // purple-100/purple-800
  'Esfuerzo: Medio': { bg: '#f3e8ff', text: '#6b21a8' },
  'Esfuerzo: Bajo': { bg: '#f3e8ff', text: '#6b21a8' },
  
  // Categorías
  'Carbono': { bg: '#e2e8f0', text: '#334155' },          // slate-200/slate-700
  'Gestión': { bg: '#e2e8f0', text: '#334155' },
  'Residuos': { bg: '#e2e8f0', text: '#334155' }
};

export function BadgePlazoSVG({ texto, bgColor = '#fee2e2', textColor = '#991b1b' }) {
  const width = Math.max(texto.length * 6 + 20, 140);
  
  return (
    <BadgeSVG
      texto={texto}
      width={width}
      height={22}
      bgColor={bgColor}
      textColor={textColor}
      fontSize={10}
      fontWeight="600"
      borderRadius={4}
    />
  );
}

export function BadgeROISVG({ roi }) {
  const texto = `ROI Estimado: ${roi}`;
  const width = Math.max(texto.length * 5.5 + 20, 200);
  
  return (
    <BadgeSVG
      texto={texto}
      width={width}
      height={20}
      bgColor="#d1fae5"  // emerald-100
      textColor="#065f46"  // emerald-800
      fontSize={10}
      fontWeight="bold"
      borderRadius={4}
    />
  );
}

/**
 * Ejemplos de uso:
 * 
 * // Badge de puntaje
 * <BadgePuntajeSVG puntaje={85} bgColor="#059669" />
 * 
 * // Badge de prioridad
 * <BadgePrioridadSVG prioridad="Alta" />
 * 
 * // Badge de atributo
 * <BadgeAtributoSVG texto="Carbono" />
 * <BadgeAtributoSVG texto="Impacto: Alto" bgColor="#dbeafe" textColor="#1e40af" />
 * 
 * // Badge de KPI
 * <BadgeKPISVG texto="kWh/mes consumidos" />
 */