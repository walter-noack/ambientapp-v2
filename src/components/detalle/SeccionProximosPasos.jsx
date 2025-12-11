export function SeccionProximosPasos() {
  const pasos = [
    {
      icon: "📋",
      texto: "Socializar este diagnóstico con el equipo de sostenibilidad"
    },
    {
      icon: "🎯",
      texto: "Priorizar acciones según impacto ambiental y facilidad de implementación"
    },
    {
      icon: "📅",
      texto: "Establecer cronograma de implementación con hitos claros"
    },
    {
      icon: "📊",
      texto: "Realizar seguimiento trimestral del progreso en cada dimensión"
    },
    {
      icon: "🔄",
      texto: "Actualizar diagnóstico anualmente para medir evolución"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg border-2 border-emerald-200">
      {/* Línea decorativa lateral */}
      <div className="absolute left-0 top-8 bottom-8 w-2 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full" />

      <div className="ml-4">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <span>🚀</span>
            Próximos Pasos
          </h2>
          <p className="text-slate-600">
            Ruta sugerida para implementar las mejoras identificadas
          </p>
        </div>

        <ul className="space-y-4">
          {pasos.map((paso, idx) => (
            <li key={idx} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-md border-2 border-emerald-200">
                {paso.icon}
              </div>
              <div className="flex-1 pt-2">
                <p className="text-slate-800 leading-relaxed">
                  {paso.texto}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}