import { Input } from '../shared/ui/Input';
import { formatDecimal, parseDecimalInput } from '../../utils/formatNumbers';

export function Paso3GestionAgua({ formData, updateFormData, errors }) {
  const handleAguaChange = (field, value) => {
    updateFormData('agua', field, value);
  };

  // Calcular intensidad hídrica automáticamente
  const calcularIntensidadHidrica = () => {
    const consumoTotal = parseDecimalInput(formData.agua.consumoTotal);
    
    if (consumoTotal === 0) {
      return { valor: 0, unidad: '' };
    }

    // Por persona
    if (formData.agua.tipoMedicion === 'persona') {
      const trabajadores = parseDecimalInput(formData.agua.numeroTrabajadores);
      
      if (trabajadores > 0) {
        const intensidad = consumoTotal / trabajadores;
        return {
          valor: intensidad,
          unidad: 'm³/persona·año'
        };
      }
    }

    // Por unidad de producción
    if (formData.agua.tipoMedicion === 'produccion') {
      const produccion = parseDecimalInput(formData.agua.produccionAnual);
      
      if (produccion > 0) {
        const intensidad = consumoTotal / produccion;
        return {
          valor: intensidad,
          unidad: 'm³/unidad'
        };
      }
    }

    return { valor: 0, unidad: '' };
  };

  const intensidadHidrica = calcularIntensidadHidrica();

  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Gestión del Agua
        </h2>
        <p className="text-slate-600">
          Ingresa el consumo hídrico anual de tu empresa
        </p>
      </div>

      {/* CONSUMO TOTAL */}
      <div className="border-2 border-blue-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">
            💧
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Consumo Total de Agua
            </h3>
            <p className="text-sm text-slate-600">
              Consumo anual en metros cúbicos
            </p>
          </div>
        </div>

        <Input
          label="Consumo Total de Agua (m³/año) *"
          type="number"
          placeholder="0"
          value={formData.agua.consumoTotal}
          onChange={(e) => handleAguaChange('consumoTotal', e.target.value)}
          error={errors.consumoTotal}
        />
      </div>

      {/* TIPO DE MEDICIÓN */}
      <div className="border-2 border-cyan-200 rounded-xl p-6 bg-gradient-to-br from-cyan-50 to-white">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Tipo de Medición de Intensidad *
          </h3>
          <p className="text-sm text-slate-600">
            Selecciona cómo medir la eficiencia hídrica
          </p>
        </div>

        {/* Radio buttons */}
        <div className="space-y-3 mb-6">
          <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:bg-cyan-50 transition-colors"
            style={{
              borderColor: formData.agua.tipoMedicion === 'persona' ? '#06b6d4' : '#e2e8f0',
              backgroundColor: formData.agua.tipoMedicion === 'persona' ? '#ecfeff' : 'white'
            }}
          >
            <input
              type="radio"
              name="tipoMedicion"
              value="persona"
              checked={formData.agua.tipoMedicion === 'persona'}
              onChange={(e) => handleAguaChange('tipoMedicion', e.target.value)}
              className="mt-1 w-5 h-5 text-cyan-600"
            />
            <div className="flex-1">
              <span className="font-semibold text-slate-900">Por persona</span>
              <p className="text-sm text-slate-600 mt-1">
                Intensidad hídrica calculada por número de trabajadores
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:bg-purple-50 transition-colors"
            style={{
              borderColor: formData.agua.tipoMedicion === 'produccion' ? '#8b5cf6' : '#e2e8f0',
              backgroundColor: formData.agua.tipoMedicion === 'produccion' ? '#f5f3ff' : 'white'
            }}
          >
            <input
              type="radio"
              name="tipoMedicion"
              value="produccion"
              checked={formData.agua.tipoMedicion === 'produccion'}
              onChange={(e) => handleAguaChange('tipoMedicion', e.target.value)}
              className="mt-1 w-5 h-5 text-purple-600"
            />
            <div className="flex-1">
              <span className="font-semibold text-slate-900">Por unidad de producción</span>
              <p className="text-sm text-slate-600 mt-1">
                Intensidad hídrica calculada por unidades producidas
              </p>
            </div>
          </label>
        </div>

        {/* Campo condicional: Número de Trabajadores */}
        {formData.agua.tipoMedicion === 'persona' && (
          <div className="p-5 bg-cyan-100 rounded-xl border-2 border-cyan-300">
            <Input
              label="Número de Trabajadores *"
              type="number"
              placeholder="Ej: 50"
              value={formData.agua.numeroTrabajadores}
              onChange={(e) => handleAguaChange('numeroTrabajadores', e.target.value)}
              error={errors.numeroTrabajadores}
            />
            <p className="text-xs text-cyan-800 mt-2">
              💡 Se calculará: m³ totales / número de trabajadores
            </p>
          </div>
        )}

        {/* Campo condicional: Producción Anual */}
        {formData.agua.tipoMedicion === 'produccion' && (
          <div className="p-5 bg-purple-100 rounded-xl border-2 border-purple-300">
            <Input
              label="Producción Anual (unidades) *"
              type="number"
              placeholder="Ej: 10000"
              value={formData.agua.produccionAnual}
              onChange={(e) => handleAguaChange('produccionAnual', e.target.value)}
              error={errors.produccionAnual}
            />
            <p className="text-xs text-purple-800 mt-2">
              💡 Se calculará: m³ totales / unidades producidas
            </p>
          </div>
        )}
      </div>

      {/* INTENSIDAD HÍDRICA CALCULADA */}
      <div className="border-2 border-slate-300 rounded-xl p-6 bg-gradient-to-br from-slate-100 to-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-600 mb-1">Intensidad Hídrica</p>
            <p className="text-4xl font-bold text-slate-900">
              {intensidadHidrica.valor > 0 ? formatDecimal(intensidadHidrica.valor, 2) : '—'}
              {intensidadHidrica.unidad && (
                <span className="text-xl text-slate-600 ml-2">{intensidadHidrica.unidad}</span>
              )}
            </p>
          </div>
          <div className="text-6xl">📊</div>
        </div>

        {intensidadHidrica.valor === 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Completa los campos para calcular la intensidad hídrica
            </p>
          </div>
        )}

        {intensidadHidrica.valor > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              ✓ La intensidad hídrica se calcula automáticamente según el tipo de medición seleccionado
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-900">
          💡 <strong>Sobre la intensidad hídrica:</strong> Este indicador mide la eficiencia en el uso del agua. 
          Un valor menor indica mejor eficiencia hídrica.
        </p>
      </div>

    </div>
  );
}