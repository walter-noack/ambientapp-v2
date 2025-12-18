import { Flame, Droplets, Recycle } from 'lucide-react';

export function SeccionResumen({ evaluacion }) {
  // Extraer puntuaciones del backend
  const carbonScore = evaluacion?.carbono?.puntuacion || 0;
  const waterScore = evaluacion?.agua?.puntuacion || 0;
  const wasteScore = evaluacion?.residuos?.puntuacion || 0;

  const kpis = [
    {
      label: "Carbono",
      valor: carbonScore,
      unidad: "/ 100",
      color: "#ef4444",
      icon: Flame
    },
    {
      label: "Agua",
      valor: waterScore,
      unidad: "/ 100",
      color: "#3b82f6",
      icon: Droplets
    },
    {
      label: "Residuos",
      valor: wasteScore,
      unidad: "/ 100",
      color: "#10b981",
      icon: Recycle
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
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              className="relative overflow-hidden rounded-xl p-6 bg-slate-50 border-2 hover:shadow-md transition-shadow"
              style={{ borderColor: kpi.color + '30' }}
            >
              {/* Contenido */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: kpi.color + '20' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    {kpi.label}
                  </p>
                </div>
                
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
          );
        })}
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