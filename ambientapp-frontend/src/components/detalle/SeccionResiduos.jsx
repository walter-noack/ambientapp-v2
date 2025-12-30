import { GraficoBarrasResiduos } from '../shared/charts/GraficoBarrasResiduos';
import { Trash2, Recycle, TrendingUp, Info } from 'lucide-react';
import { formatDecimal } from '../../utils/formatNumbers';

export function SeccionResiduos({ generados, valorizados }) {
  const porcentajeValorizacion = generados > 0 
    ? ((valorizados / generados) * 100).toFixed(1) 
    : 0;

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Gestión de Residuos
        </h2>
        <p className="text-slate-600">
          Análisis de residuos generados y tasa de valorización
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Gráfico de barras */}
        <div className="flex flex-col justify-center">
          <GraficoBarrasResiduos 
            generados={generados} 
            valorizados={valorizados} 
          />
        </div>

        {/* Información y métricas */}
        <div className="space-y-4">
          {/* KPIs principales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border-2 border-red-200 bg-red-50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs uppercase tracking-wider text-red-700 font-semibold">
                  Generado
                </p>
              </div>
              <p className="text-3xl font-bold text-red-600 mb-1">
                {formatDecimal(generados, 0)}
              </p>
              <p className="text-sm text-red-700">kg</p>
            </div>

            <div className="p-5 rounded-xl border-2 border-green-200 bg-green-50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Recycle className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs uppercase tracking-wider text-green-700 font-semibold">
                  Valorizado
                </p>
              </div>
              <p className="text-3xl font-bold text-green-600 mb-1">
                {formatDecimal(valorizados, 0)}
              </p>
              <p className="text-sm text-green-700">kg</p>
            </div>
          </div>

          {/* Porcentaje de valorización */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-purple-900">
                Tasa de Valorización
              </p>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <p className="text-5xl font-bold text-purple-600">
                {porcentajeValorizacion}
              </p>
              <span className="text-2xl text-purple-600">%</span>
            </div>
            
            {/* Barra de progreso */}
            <div className="w-full h-3 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${porcentajeValorizacion}%` }}
              />
            </div>
          </div>

          {/* Evaluación */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
              Evaluación
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {porcentajeValorizacion >= 70 
                ? `Excelente desempeño en valorización de residuos (${porcentajeValorizacion}%). 
                   La empresa está por encima del promedio del sector.`
                : porcentajeValorizacion >= 40
                ? `Valorización moderada (${porcentajeValorizacion}%). Hay oportunidades 
                   para mejorar la gestión de residuos.`
                : `Valorización baja (${porcentajeValorizacion}%). Es prioritario implementar 
                   estrategias de economía circular y gestión de residuos.`
              }
            </p>
          </div>

          {/* Contexto */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong>Meta sector:</strong> El promedio del sector apunta a una 
                valorización del 50-60%. La meta ideal es superar el 70%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}