export function SeccionResumen({ evaluacion }) {
  const { carbonScore, waterScore, wasteScore } = evaluacion.scores || {};

  const kpis = [
    {
      label: "Carbono",
      valor: carbonScore || 0,
      unidad: "/ 100",
      color: "#DC2626",
      icon: "🌍"
    },
    {
      label: "Agua",
      valor: waterScore || 0,
      unidad: "/ 100",
      color: "#2563EB",
      icon: "💧"
    },
    {
      label: "Residuos",
      valor: wasteScore || 0,
      unidad: "/ 100",
      color: "#059669",
      icon: "♻️"
    },
  ];

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Resumen Ejecutivo
        </h2>
        <p className="text-slate-600">
          Principales indicadores del diagnóstico ambiental
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx}
            className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-slate-50 to-white border-2 hover:shadow-md transition-shadow"
            style={{ borderColor: kpi.color + '30' }}
          >
            {/* Icono de fondo */}
            <div 
              className="absolute -right-4 -top-4 text-6xl opacity-10"
            >
              {kpi.icon}
            </div>

            {/* Contenido */}
            <div className="relative">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                {kpi.label}
              </p>
              <div className="flex items-baseline gap-2">
                <p 
                  className="text-4xl font-bold"
                  style={{ color: kpi.color }}
                >
                  {kpi.valor}
                </p>
                <span className="text-sm text-slate-500">{kpi.unidad}</span>
              </div>
            </div>

            {/* Barra decorativa */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: kpi.color }}
            />
          </div>
        ))}
      </div>

      {/* Descripción contextual */}
      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-sm text-slate-700 leading-relaxed">
          El diagnóstico evalúa tres dimensiones ambientales clave: 
          <strong> carbono</strong> (40% del puntaje final),
          <strong> agua</strong> (30%) y 
          <strong> residuos</strong> (30%).
          Cada dimensión se analiza en función de consumos, prácticas de gestión 
          y cumplimiento normativo.
        </p>
      </div>
    </section>
  );
}