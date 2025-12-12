// Sistema de validaciones para formulario multi-paso

export function validarPaso1(formData) {
  const errores = {};
  
  // Validar nombre de empresa
  if (!formData.companyName || formData.companyName.trim() === '') {
    errores.companyName = 'El nombre de la empresa es obligatorio';
  } else if (formData.companyName.trim().length < 3) {
    errores.companyName = 'El nombre debe tener al menos 3 caracteres';
  }
  
  // Verificar que al menos una dimensión esté seleccionada
  const alMenosUnaDimension = 
    formData.dimensiones.carbono || 
    formData.dimensiones.agua || 
    formData.dimensiones.residuos || 
    formData.dimensiones.rep;
  
  if (!alMenosUnaDimension) {
    errores.dimensiones = 'Debes seleccionar al menos una dimensión para evaluar';
  }
  
  return errores;
}

export function validarPaso2(formData) {
  const errores = {};
  
  // Al menos un campo debe tener valor
  const valores = Object.values(formData.carbono);
  const tieneAlgunValor = valores.some(val => val && parseFloat(val) > 0);
  
  if (!tieneAlgunValor) {
    errores.general = 'Debes ingresar al menos un consumo de combustible o electricidad';
  }
  
  // Validar que sean números válidos y positivos
  Object.keys(formData.carbono).forEach(key => {
    const valor = formData.carbono[key];
    if (valor && valor !== '') {
      const num = parseFloat(valor);
      if (isNaN(num)) {
        errores[key] = 'Debe ser un número válido';
      } else if (num < 0) {
        errores[key] = 'El valor debe ser positivo';
      }
    }
  });
  
  return errores;
}

export function validarPaso3(formData) {
  const errores = {};
  
  // Validar consumo total
  if (!formData.agua.consumoTotal || formData.agua.consumoTotal.trim() === '') {
    errores.consumoTotal = 'El consumo total de agua es obligatorio';
  } else {
    const consumo = parseFloat(formData.agua.consumoTotal);
    if (isNaN(consumo)) {
      errores.consumoTotal = 'Debe ser un número válido';
    } else if (consumo <= 0) {
      errores.consumoTotal = 'El consumo debe ser mayor a cero';
    }
  }
  
  // Validar según tipo de medición
  if (formData.agua.tipoMedicion === 'persona') {
    if (!formData.agua.numeroTrabajadores || formData.agua.numeroTrabajadores.trim() === '') {
      errores.numeroTrabajadores = 'El número de trabajadores es obligatorio';
    } else {
      const num = parseFloat(formData.agua.numeroTrabajadores);
      if (isNaN(num)) {
        errores.numeroTrabajadores = 'Debe ser un número válido';
      } else if (num <= 0) {
        errores.numeroTrabajadores = 'Debe haber al menos 1 trabajador';
      } else if (!Number.isInteger(num)) {
        errores.numeroTrabajadores = 'Debe ser un número entero';
      }
    }
  }
  
  if (formData.agua.tipoMedicion === 'produccion') {
    if (!formData.agua.produccionAnual || formData.agua.produccionAnual.trim() === '') {
      errores.produccionAnual = 'La producción anual es obligatoria';
    } else {
      const prod = parseFloat(formData.agua.produccionAnual);
      if (isNaN(prod)) {
        errores.produccionAnual = 'Debe ser un número válido';
      } else if (prod <= 0) {
        errores.produccionAnual = 'La producción debe ser mayor a cero';
      }
    }
  }
  
  return errores;
}

export function validarPaso4(formData) {
  const errores = {};
  
  // Validar residuos generados
  if (!formData.residuos.generados || formData.residuos.generados.trim() === '') {
    errores.generados = 'Los residuos generados son obligatorios';
  } else {
    const gen = parseFloat(formData.residuos.generados);
    if (isNaN(gen)) {
      errores.generados = 'Debe ser un número válido';
    } else if (gen <= 0) {
      errores.generados = 'Debe ser mayor a cero';
    }
  }
  
  // Validar residuos valorizados
  if (!formData.residuos.valorizados || formData.residuos.valorizados.trim() === '') {
    errores.valorizados = 'Los residuos valorizados son obligatorios (puede ser 0)';
  } else {
    const val = parseFloat(formData.residuos.valorizados);
    if (isNaN(val)) {
      errores.valorizados = 'Debe ser un número válido';
    } else if (val < 0) {
      errores.valorizados = 'No puede ser negativo';
    }
  }
  
  // Validación de negocio: valorizados no puede ser mayor que generados
  const generados = parseFloat(formData.residuos.generados) || 0;
  const valorizados = parseFloat(formData.residuos.valorizados) || 0;
  
  if (valorizados > generados) {
    errores.valorizados = 'Los residuos valorizados no pueden superar los generados';
  }
  
  return errores;
}

export function validarPaso5(formData) {
  // Paso 5 (REP) es opcional
  // La validación se hace al agregar cada producto individualmente
  return {};
}

// Función helper para validar un paso según su nombre
export function validarPasoPorNombre(nombrePaso, formData) {
  switch (nombrePaso) {
    case 'Información General':
      return validarPaso1(formData);
    case 'Huella de Carbono':
      return validarPaso2(formData);
    case 'Gestión del Agua':
      return validarPaso3(formData);
    case 'Gestión de Residuos':
      return validarPaso4(formData);
    case 'Productos REP':
      return validarPaso5(formData);
    case 'Revisión':
      return {}; // Paso final, no hay validaciones
    default:
      return {};
  }
}