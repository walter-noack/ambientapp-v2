// Formatear número para mostrar con comas decimales
export function formatDecimal(number, decimales = 2) {
  if (number === null || number === undefined || isNaN(number)) return '0';
  
  return Number(number)
    .toFixed(decimales)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Parsear input que puede tener coma como decimal
export function parseDecimalInput(value) {
  if (!value) return 0;
  
  // Reemplazar coma por punto para parseFloat
  const normalized = String(value).replace(',', '.');
  return parseFloat(normalized) || 0;
}