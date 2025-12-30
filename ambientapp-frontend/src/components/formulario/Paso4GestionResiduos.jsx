import { Input } from '../shared/ui/Input';
import { formatDecimal, parseDecimalInput } from '../../utils/formatNumbers';
import { calcularScoreResiduos } from '../../utils/calculosHuella';

export function Paso4GestionResiduos({ formData, updateFormData, errors }) {
  const handleResiduosChange = (field, value) => {
    updateFormData('residuos', field, value);
  };

  // Calcular tasa de valorización automáticamente
  const calcularTasaValorizacion = () => {
    const generados = parseDecimalInput(formData.residuos.generados);
    const valorizados = parseDecimalInput(formData.residuos.valorizados);

    if (generados === 0) {
      return { porcentaje: 0, estado: 'sin-datos' };
    }

    const porcentaje = (valorizados / generados) * 100;

    // Determinar estado según porcentaje
    let estado = 'bajo';
    if (porcentaje >= 70) estado = 'excelente';
    else if (porcentaje >= 50) estado = 'bueno';
    else if (porcentaje >= 30) estado = 'regular';

    return { porcentaje, estado };
  };

  const tasaValorizacion = calcularTasaValorizacion();

  const estadoConfig = {
    'excelente': { color: '#10b981', bg: '#ecfdf5', text: 'Excelente', icon: '🌟' },
    'bueno': { color: '#3b82f6', bg: '#eff6ff', text: 'Bueno', icon: '✓' },
    'regular': { color: '#f59e0b', bg: '#fffbeb', text: 'Regular', icon: '⚠️' },
    'bajo': { color: '#ef4444', bg: '#fef2f2', text: 'Bajo', icon: '⚡' },
    'sin-datos': { color: '#64748b', bg: '#f8fafc', text: 'Sin datos', icon: '—' }
  };

  const estadoActual = estadoConfig[tasaValorizacion.estado];

  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Gestión de Residuos
        </h2>
        <p className="text-slate-600">
          Ingresa los residuos generados y valorizados anualmente
        </p>
      </div>

      {/* RESIDUOS GENERADOS */}
      <div className="border-2 border-red-200 rounded-xl p-6 bg-gradient-to-br from-red-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-2xl">
            🗑️
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Residuos Totales Generados
            </h3>
            <p className="text-sm text-slate-600">
              Cantidad total de residuos producidos al año
            </p>
          </div>
        </div>

        <Input
          label="Residuos Generados (kg/año) *"
          type="number"
          placeholder="0"
          value={formData.residuos.generados}
          onChange={(e) => handleResiduosChange('generados', e.target.value)}
          error={errors.generados}
        />
      </div>

      {/* RESIDUOS VALORIZADOS */}
      <div className="border-2 border-green-200 rounded-xl p-6 bg-gradient-to-br from-green-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-2xl">
            ♻️
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Residuos Valorizados
            </h3>
            <p className="text-sm text-slate-600">
              Residuos reciclados, compostados o reutilizados
            </p>
          </div>
        </div>

        <Input
          label="Residuos Valorizados (kg/año) *"
          type="number"
          placeholder="0"
          value={formData.residuos.valorizados}
          onChange={(e) => handleResiduosChange('valorizados', e.target.value)}
          error={errors.valorizados}
        />
      </div>

      {/* TASA DE VALORIZACIÓN CALCULADA */}
      <div className="border-2 border-slate-300 rounded-xl p-6 bg-gradient-to-br from-slate-100 to-white">
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-1">Tasa de Valorización</p>
          <div className="flex items-baseline gap-3">
            <p className="text-6xl font-bold text-slate-900">
              {tasaValorizacion.porcentaje > 0 
                ? formatDecimal(tasaValorizacion.porcentaje, 1) 
                : '—'}
            </p>
            {tasaValorizacion.porcentaje > 0 && (
              <span className="text-3xl text-slate-600">%</span>
            )}
          </div>
        </div>

        {/* Barra de progreso */}
        {tasaValorizacion.porcentaje > 0 && (
          <div className="mb-4">
            <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(tasaValorizacion.porcentaje, 100)}%`,
                  backgroundColor: estadoActual.color
                }}
              />
            </div>
          </div>
        )}

        {/* Estado */}
        <div 
          className="p-4 rounded-xl border-2"
          style={{
            backgroundColor: estadoActual.bg,
            borderColor: estadoActual.color + '40'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{estadoActual.icon}</span>
            <div className="flex-1">
              <p className="font-bold text-slate-900 mb-1">
                Estado: {estadoActual.text}
              </p>
              <p className="text-sm text-slate-700">
                {tasaValorizacion.estado === 'excelente' && 
                  'Excelente desempeño en valorización de residuos (≥70%). La empresa está por encima del promedio del sector.'}
                {tasaValorizacion.estado === 'bueno' && 
                  'Buen nivel de valorización (50-70%). La empresa cumple con estándares aceptables.'}
                {tasaValorizacion.estado === 'regular' && 
                  'Valorización moderada (30-50%). Hay oportunidades para mejorar la gestión de residuos.'}
                {tasaValorizacion.estado === 'bajo' && 
                  'Valorización baja (<30%). Es prioritario implementar estrategias de economía circular.'}
                {tasaValorizacion.estado === 'sin-datos' && 
                  'Completa los campos para calcular la tasa de valorización'}
              </p>
            </div>
          </div>
        </div>

        {/* KPIs comparativos */}
        {tasaValorizacion.porcentaje > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Generados</p>
              <p className="text-lg font-bold text-red-600">
                {formatDecimal(parseDecimalInput(formData.residuos.generados) / 1000, 1)}
                <span className="text-xs ml-1">ton</span>
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Valorizados</p>
              <p className="text-lg font-bold text-green-600">
                {formatDecimal(parseDecimalInput(formData.residuos.valorizados) / 1000, 1)}
                <span className="text-xs ml-1">ton</span>
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">No valorizados</p>
              <p className="text-lg font-bold text-slate-600">
                {formatDecimal((parseDecimalInput(formData.residuos.generados) - parseDecimalInput(formData.residuos.valorizados)) / 1000, 1)}
                <span className="text-xs ml-1">ton</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-900">
          📊 <strong>Meta del sector:</strong> El promedio del sector industrial apunta a una valorización del 50-60%. 
          La meta ideal es superar el 70%.
        </p>
      </div>

    </div>
  );
}