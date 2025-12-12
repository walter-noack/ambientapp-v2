import { Target, TrendingUp, AlertCircle } from 'lucide-react';

export function SeccionAnalisis() {
  return (
    <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-xl text-white border border-slate-700">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">
          Análisis Integrado y Prioridades
        </h2>
        <p className="text-slate-300">
          Síntesis estratégica del diagnóstico ambiental
        </p>
      </div>

      <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        <p className="text-slate-100 leading-relaxed">
          Este diagnóstico ambiental proporciona una evaluación integral del desempeño 
          de la empresa en las dimensiones de carbono, agua y residuos. Los resultados 
          permiten identificar fortalezas y oportunidades de mejora para avanzar hacia 
          prácticas más sostenibles y cumplir con los estándares ambientales.
        </p>
      </div>

      {/* Indicadores */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Fortalezas</p>
            <p className="text-sm font-semibold text-emerald-400">Identificadas</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Mejoras</p>
            <p className="text-sm font-semibold text-amber-400">Oportunidades</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Prioridades</p>
            <p className="text-sm font-semibold text-red-400">Críticas</p>
          </div>
        </div>
      </div>
    </section>
  );
}