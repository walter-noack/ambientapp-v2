 import { Droplets, Users, Factory, TrendingDown, Info } from 'lucide-react';
import { formatDecimal } from '../../utils/formatNumbers';

export function SeccionAgua({ evaluacion }) {
  const consumoTotal = evaluacion.agua?.consumoTotal || 0;
  const tipoMedicion = evaluacion.agua?.tipoMedicion || '';
  const numeroTrabajadores = evaluacion.agua?.numeroTrabajadores || 0;
  const produccionAnual = evaluacion.agua?.produccionAnual || 0;

  // Calcular intensidad hídrica
  let intensidadHidrica = null;
  if (consumoTotal > 0) {
    if (tipoMedicion === 'persona' && numeroTrabajadores > 0) {
      intensidadHidrica = {
        valor: consumoTotal / numeroTrabajadores,
        unidad: 'm³/persona·año',
        tipo: 'per cápita'
      };
    } else if (tipoMedicion === 'produccion' && produccionAnual > 0) {
      intensidadHidrica = {
        valor: consumoTotal / produccionAnual,
        unidad: 'm³/unidad',
        tipo: 'por producción'
      };
    }
  }

  // Determinar nivel de eficiencia
  let nivelEficiencia = 'sin-datos';
  let mensajeEficiencia = '';
  
  if (intensidadHidrica) {
    if (tipoMedicion === 'persona') {
      if (intensidadHidrica.valor < 30) {
        nivelEficiencia = 'excelente';
        mensajeEficiencia = 'Consumo per cápita excelente, por debajo del promedio industrial (30-40 m³/persona·año).';
      } else if (intensidadHidrica.valor <= 50) {
        nivelEficiencia = 'bueno';
        mensajeEficiencia = 'Consumo per cápita en rango aceptable. Hay oportunidades de optimización.';
      } else {
        nivelEficiencia = 'alto';
        mensajeEficiencia = 'Consumo per cápita elevado. Se recomienda implementar medidas de ahorro urgentes.';
      }
    } else {
      // Por producción (umbrales genéricos)
      nivelEficiencia = 'bueno';
      mensajeEficiencia = 'Intensidad hídrica registrada. Evaluar contra benchmarks del sector.';
    }
  }

  const nivelConfig = {
    'excelente': { color: '#10b981', bg: '#ecfdf5', icon: TrendingDown },
    'bueno': { color: '#3b82f6', bg: '#eff6ff', icon: Droplets },
    'alto': { color: '#ef4444', bg: '#fef2f2', icon: Droplets },
    'sin-datos': { color: '#64748b', bg: '#f8fafc', icon: Droplets }
  };

  const config = nivelConfig[nivelEficiencia];
  const IconComponent = config.icon;

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Gestión del Agua
        </h2>
        <p className="text-slate-600">
          Análisis de consumo hídrico e intensidad de uso
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Columna izquierda: Datos principales */}
        <div className="space-y-4">
          
          {/* Consumo Total */}
          <div className="p-6 rounded-xl border-2 border-blue-200 bg-blue-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs uppercase tracking-wider text-blue-700 font-semibold">
                Consumo Total Anual
              </p>
            </div>
            <p className="text-4xl font-bold text-blue-600 mb-1">
              {formatDecimal(consumoTotal, 0)}
            </p>
            <p className="text-sm text-blue-700">m³/año</p>
          </div>

          {/* Tipo de medición */}
          <div className="p-6 rounded-xl border-2 border-cyan-200 bg-cyan-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                {tipoMedicion === 'persona' ? (
                  <Users className="w-5 h-5 text-white" />
                ) : (
                  <Factory className="w-5 h-5 text-white" />
                )}
              </div>
              <p className="text-xs uppercase tracking-wider text-cyan-700 font-semibold">
                Tipo de Medición
              </p>
            </div>
            <p className="text-lg font-semibold text-cyan-900 mb-2">
              {tipoMedicion === 'persona' ? 'Por Persona' : 'Por Unidad de Producción'}
            </p>
            {tipoMedicion === 'persona' && (
              <p className="text-sm text-cyan-700">
                {formatDecimal(numeroTrabajadores, 0)} trabajadores
              </p>
            )}
            {tipoMedicion === 'produccion' && (
              <p className="text-sm text-cyan-700">
                {formatDecimal(produccionAnual, 0)} unidades producidas
              </p>
            )}
          </div>

        </div>

        {/* Columna derecha: Intensidad y análisis */}
        <div className="space-y-4">
          
          {/* Intensidad Hídrica */}
          {intensidadHidrica ? (
            <div 
              className="p-6 rounded-xl border-2"
              style={{ 
                backgroundColor: config.bg,
                borderColor: config.color
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: config.color + '30' }}
                >
                  <IconComponent className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: config.color }}>
                    Intensidad Hídrica
                  </p>
                  <p className="text-xs text-slate-600">
                    {intensidadHidrica.tipo}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-4xl font-bold" style={{ color: config.color }}>
                  {formatDecimal(intensidadHidrica.valor, 2)}
                </p>
                <p className="text-sm font-medium text-slate-700 mt-1">
                  {intensidadHidrica.unidad}
                </p>
              </div>

              {/* Nivel de eficiencia */}
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: 'white' }}
              >
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                  Evaluación
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {mensajeEficiencia}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border-2 border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-500">
                No se puede calcular intensidad hídrica con los datos disponibles.
              </p>
            </div>
          )}

          {/* Comparación con benchmarks */}
          {tipoMedicion === 'persona' && intensidadHidrica && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
                Comparación con Benchmarks
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Oficinas eficientes</span>
                  <span className="text-sm font-semibold text-green-600">20-30 m³/persona·año</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Promedio industrial</span>
                  <span className="text-sm font-semibold text-blue-600">30-50 m³/persona·año</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Consumo elevado</span>
                  <span className="text-sm font-semibold text-red-600">&gt;50 m³/persona·año</span>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-700">Tu empresa</span>
                    <span className="text-sm font-bold" style={{ color: config.color }}>
                      {formatDecimal(intensidadHidrica.valor, 1)} m³/persona·año
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info adicional */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Intensidad hídrica:</strong> Indicador clave de eficiencia. 
                Un valor menor indica mejor uso del recurso hídrico. Se recomienda 
                establecer metas anuales de reducción.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}