import { GraficoBarrasResiduos } from '../shared/charts/GraficoBarrasResiduos';

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
              <p className="text-xs uppercase tracking-wider text-red-700 mb-2">
                Total Generado
              </p>
              <p className="text-3xl font-bold text-red-600 mb-1">
                {generados.toLocaleString()}
              </p>
              <p className="text-sm text-red-700">kg</p>
            </div>

            <div className="p-5 rounded-xl border-2 border-green-200 bg-green-50">
              <p className="text-xs uppercase tracking-wider text-green-700 mb-2">
                Valorizado
              </p>
              <p className="text-3xl font-bold text-green-600 mb-1">
                {valorizados.toLocaleString()}
              </p>
              <p className="text-sm text-green-700">kg</p>
            </div>
          </div>

          {/* Porcentaje de valorización */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
            <p className="text-sm font-semibold text-purple-900 mb-2">
              Tasa de Valorización
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-bold text-purple-600">
                {porcentajeValorizacion}
              </p>
              <span className="text-2xl text-purple-600">%</span>
            </div>
            
            {/* Barra de progreso */}
            <div className="mt-4 w-full h-3 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${porcentajeValorizacion}%` }}
              />
            </div>
          </div>

          {/* Interpretación */}
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
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>📊 Meta sector:</strong> El promedio del sector apunta a una 
              valorización del 50-60%. La meta ideal es superar el 70%.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}