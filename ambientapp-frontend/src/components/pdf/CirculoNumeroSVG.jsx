// src/components/pdf/CirculoNumeroSVG.jsx
// Solución definitiva usando SVG para centrado perfecto en html2pdf

import React from 'react';

/**
 * Círculo con número usando SVG
 * Funciona perfectamente en html2pdf porque SVG se renderiza como imagen
 */
export function CirculoNumeroSVG({ 
  numero, 
  size = 32,           // Tamaño en px
  bgColor = '#dc2626', // Color de fondo (hex)
  textColor = '#ffffff', // Color del texto (hex)
  fontSize = 14        // Tamaño de fuente en px
}) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      style={{ flexShrink: 0 }}
    >
      {/* Círculo de fondo */}
      <circle 
        cx={size / 2} 
        cy={size / 2} 
        r={size / 2} 
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
        fontWeight="bold"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {numero}
      </text>
    </svg>
  );
}

/**
 * Versión con sombra para que coincida con el diseño actual
 */
export function CirculoNumeroSVGConSombra({ 
  numero, 
  size = 32,
  bgColor = '#dc2626',
  textColor = '#ffffff',
  fontSize = 14
}) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      style={{ 
        flexShrink: 0,
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
      }}
    >
      {/* Círculo de fondo */}
      <circle 
        cx={size / 2} 
        cy={size / 2} 
        r={size / 2} 
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
        fontWeight="bold"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {numero}
      </text>
    </svg>
  );
}

/**
 * Mapeo de colores Tailwind a hex
 */
const COLORES_TAILWIND = {
  'bg-red-600': '#dc2626',
  'bg-orange-600': '#ea580c',
  'bg-yellow-600': '#ca8a04',
  'bg-green-600': '#16a34a',
  'bg-blue-600': '#2563eb',
  'bg-purple-600': '#9333ea',
  'bg-emerald-600': '#059669',
};

/**
 * Wrapper que acepta clases Tailwind y las convierte a hex
 */
export function CirculoNumeroTailwind({ 
  numero, 
  bgColor = 'bg-red-600', 
  size = 32,
  fontSize = 14
}) {
  const hexColor = COLORES_TAILWIND[bgColor] || '#dc2626';
  
  return (
    <CirculoNumeroSVG
      numero={numero}
      size={size}
      bgColor={hexColor}
      fontSize={fontSize}
    />
  );
}

/**
 * Ejemplos de uso:
 * 
 * // Básico con hex
 * <CirculoNumeroSVG numero={1} size={32} bgColor="#dc2626" />
 * 
 * // Con clase Tailwind
 * <CirculoNumeroTailwind numero={1} bgColor="bg-red-600" size={32} />
 * 
 * // Con sombra
 * <CirculoNumeroSVGConSombra numero={1} size={32} bgColor="#dc2626" />
 */