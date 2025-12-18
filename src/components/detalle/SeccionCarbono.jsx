import { GraficoDonutCarbono } from '../shared/charts/GraficoDonutCarbono';
import { Flame, Zap, Factory, Lightbulb } from 'lucide-react';

export function SeccionCarbono({ alcance1, alcance2 }) {
  // Los valores vienen en kg del backend, convertir a toneladas
  const alcance1Ton = alcance1 / 1000;
  const alcance2Ton = alcance2 / 1000;
  const totalTon = alcance1Ton + alcance2Ton;
  
  const porcentajeA1 = totalTon > 0 ? ((alcance1Ton / totalTon) * 100).toFixed(1) : 0;
  const porcentajeA2 = totalTon > 0 ? ((alcance2Ton / totalTon) * 100).toFixed(1) : 0;

  // Función para formatear números con comas chilenas
  const formatNumber = (num) => {
    return num.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Huella de Carbono — Alcances 1 y 2
        </h2>
        <p className="text-slate-600">
          Distribución de emisiones entre combustibles directos y electricidad
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Gráfico donut */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-xs relative">
            <GraficoDonutCarbono alcance1={alcance1Ton} alcance2={alcance2Ton} />
            
            {/* Total al centro */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-3xl font-bold text-slate-900">
                  {formatNumber(totalTon)}
                </p>
                <p className="text-xs text-slate-500">tCO₂e</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desglose y análisis */}
        <div className="space-y-4">
          {/* Tarjetas A1 / A2 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border-2 border-emerald-200 bg-emerald-50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Factory className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">
                  Alcance 1
                </p>
              </div>
              <p className="text-3xl font-bold text-emerald-600 mb-1">
                {formatNumber(alcance1Ton)}
              </p>
              <p className="text-sm text-emerald-700 mb-2">
                tCO₂e ({porcentajeA1}%)
              </p>
              <p className="text-xs text-slate-600">
                Combustibles directos
              </p>
            </div>

            <div className="p-5 rounded-xl border-2 border-sky-200 bg-sky-50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs uppercase tracking-wider text-sky-700 font-semibold">
                  Alcance 2
                </p>
              </div>
              <p className="text-3xl font-bold text-sky-600 mb-1">
                {formatNumber(alcance2Ton)}
              </p>
              <p className="text-sm text-sky-700 mb-2">
                tCO₂e ({porcentajeA2}%)
              </p>
              <p className="text-xs text-slate-600">
                Electricidad consumida
              </p>
            </div>
          </div>

          {/* Interpretación */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Flame className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
                  Interpretación
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  El alcance {porcentajeA1 > porcentajeA2 ? '1' : '2'} representa la mayor 
                  fuente de emisiones con un {Math.max(porcentajeA1, porcentajeA2)}% del total. 
                  Priorizar acciones en esta área tendrá mayor impacto en la reducción de la 
                  huella de carbono.
                </p>
              </div>
            </div>
          </div>

          {/* Contexto adicional */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Dato clave:</strong> Las emisiones de Alcance 1 provienen de 
                fuentes controladas directamente (vehículos, calderas), mientras que las 
                de Alcance 2 son emisiones indirectas por consumo eléctrico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}