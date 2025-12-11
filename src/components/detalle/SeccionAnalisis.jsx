export function SeccionAnalisis() {
  return (
    <section className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-8 shadow-xl text-white">
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

      {/* Decoración visual */}
      <div className="mt-6 flex items-center gap-4 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span>Fortalezas identificadas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span>Áreas de mejora</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span>Prioridades críticas</span>
        </div>
      </div>
    </section>
  );
}