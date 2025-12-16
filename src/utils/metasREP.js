// src/utils/metasREP.js
/**
 * Metas de valorización según Ley REP Chile
 * Basado en decretos oficiales
 */

// ENVASES Y EMBALAJES DOMICILIARIOS (D.S. 12/2020)
const metasEnvasesDomiciliarios = {
  'Cartón para Líquidos': [5, 8, 11, 15, 19, 23, 27, 31, 36, 40, 50, 60],
  'Metal': [6, 9, 12, 15, 17, 21, 25, 29, 32, 36, 45, 55],
  'Papel y Cartón': [5, 9, 14, 18, 23, 28, 34, 39, 45, 50, 60, 70],
  'Plástico': [3, 6, 8, 11, 14, 17, 20, 23, 27, 30, 37, 45],
  'Vidrio': [11, 15, 19, 22, 26, 31, 37, 42, 47, 52, 58, 65]
};

// ENVASES Y EMBALAJES NO DOMICILIARIOS (D.S. 12/2020)
const metasEnvasesNoDomiciliarios = {
  'Metal': [23, 32, 42, 51, 61, 64, 66, 68, 70],
  'Papel y Cartón': [48, 54, 60, 65, 71, 74, 78, 81, 85],
  'Plástico': [13, 19, 25, 32, 38, 42, 46, 51, 55]
};

// ACEITES Y LUBRICANTES (D.S. 47/2024)
const metasAceitesLubricantes = [50, 52, 54, 59, 64, 69, 73, 77, 81, 85, 88, 90];

// NEUMÁTICOS CATEGORÍA A (D.S. N°8/2019)
const metasNeumaticosA = {
  valorización: [25, 30, 35, 60, 60, 80, 80, 90],
  recolección: [50, 50, 50, 80, 80, 80, 80, 90]
};

// NEUMÁTICOS CATEGORÍA B (D.S. N°8/2019)
const metasNeumaticosB = [25, 25, 25, 25, 75, 75, 75, 100];

// APARATOS ELÉCTRICOS Y ELECTRÓNICOS - RAEE (ejemplo genérico)
const metasRAEE = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75];

/**
 * Obtiene la meta de valorización para un producto específico en un año determinado
 * @param {string} producto - Nombre del producto prioritario
 * @param {number} anio - Año de evaluación (2024, 2025, etc.)
 * @param {string} subcategoria - Subcategoría del producto (opcional)
 * @returns {number} - Porcentaje de meta de valorización
 */
export function obtenerMetaREP(producto, anio = 2024, subcategoria = null) {
  // Año base según normativa (ajustar según entrada en vigencia)
  const anioBase = 2024; // Primer año de vigencia
  const indiceAnio = Math.max(0, anio - anioBase);
  
  // Normalizar nombre del producto
  const productoNorm = producto.toLowerCase().trim();
  
  // ENVASES Y EMBALAJES
  if (productoNorm.includes('envase') || productoNorm.includes('embalaje')) {
    const esDomiciliario = productoNorm.includes('domiciliario');
    const esNoDomiciliario = productoNorm.includes('no domiciliario');
    
    if (subcategoria) {
      const subcatNorm = subcategoria.trim();
      
      if (esDomiciliario && metasEnvasesDomiciliarios[subcatNorm]) {
        return metasEnvasesDomiciliarios[subcatNorm][Math.min(indiceAnio, 11)] || 60;
      }
      
      if (esNoDomiciliario && metasEnvasesNoDomiciliarios[subcatNorm]) {
        return metasEnvasesNoDomiciliarios[subcatNorm][Math.min(indiceAnio, 8)] || 70;
      }
    }
    
    // Meta genérica para envases sin especificar
    return 40;
  }
  
  // ACEITES Y LUBRICANTES
  if (productoNorm.includes('aceite') || productoNorm.includes('lubricante')) {
    return metasAceitesLubricantes[Math.min(indiceAnio, 11)] || 90;
  }
  
  // NEUMÁTICOS
  if (productoNorm.includes('neumático') || productoNorm.includes('neumatico')) {
    if (productoNorm.includes('categoria b') || productoNorm.includes('categoría b')) {
      return metasNeumaticosB[Math.min(indiceAnio, 7)] || 100;
    }
    // Por defecto: Categoría A
    return metasNeumaticosA.valorización[Math.min(indiceAnio, 7)] || 90;
  }
  
  // RAEE (Aparatos Eléctricos y Electrónicos)
  if (productoNorm.includes('raee') || 
      productoNorm.includes('eléctrico') || 
      productoNorm.includes('electrónico') ||
      productoNorm.includes('aparato')) {
    return metasRAEE[Math.min(indiceAnio, 9)] || 75;
  }
  
  // PILAS Y BATERÍAS
  if (productoNorm.includes('pila') || productoNorm.includes('batería')) {
    return 50; // Meta genérica
  }
  
  // DIARIOS Y PERIÓDICOS
  if (productoNorm.includes('diario') || productoNorm.includes('periódico')) {
    return 60; // Meta genérica
  }
  
  // Meta por defecto
  return 50;
}

/**
 * Obtiene información detallada de la meta para mostrar en el gráfico
 */
export function obtenerInfoMeta(producto, anio = 2024) {
  const meta = obtenerMetaREP(producto, anio);
  const productoNorm = producto.toLowerCase();
  
  let decreto = 'Ley REP 20.920';
  
  if (productoNorm.includes('envase') || productoNorm.includes('embalaje')) {
    decreto = 'D.S. 12/2020';
  } else if (productoNorm.includes('aceite') || productoNorm.includes('lubricante')) {
    decreto = 'D.S. 47/2024';
  } else if (productoNorm.includes('neumático')) {
    decreto = 'D.S. 8/2019';
  }
  
  return {
    meta,
    decreto,
    anio
  };
}

export default {
  obtenerMetaREP,
  obtenerInfoMeta
};