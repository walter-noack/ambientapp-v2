export function SeccionPortada({ evaluacion }) {
  // Determinar nivel y color
  let nivel = "Bajo";
  let colorNivel = "#DC2626";

  if (evaluacion.finalScore >= 75) {
    nivel = "Avanzado";
    colorNivel = "#2563EB";
  } else if (evaluacion.finalScore >= 50) {
    nivel = "Intermedio";
    colorNivel = "#F59E0B";
  } else if (evaluacion.finalScore >= 25) {
    nivel = "Básico";
    colorNivel = "#EF4444";
  }

  return (
    <div 
      className="relative overflow-hidden rounded-2xl p-12 shadow-xl"
      style={{
        background: `
          radial-gradient(circle at 20% 10%, rgba(16,185,129,.09), transparent 60%),
          radial-gradient(circle at 80% 90%, rgba(37,99,235,.08), transparent 60%),
          white
        `
      }}
    >
      {/* Logo placeholder */}
      <div className="mb-8">
        <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-2xl">A</span>
        </div>
      </div>

      {/* Título principal */}
      <div className="space-y-2 mb-8">
        <h1 className="text-5xl font-bold text-slate-900 leading-tight">
          Diagnóstico Ambiental
        </h1>
        <h2 className="text-3xl font-semibold text-slate-700">
          {evaluacion.companyName}
        </h2>
      </div>

      {/* Metadatos */}
      <div className="flex gap-8 text-sm text-slate-600 mb-12">
        <div>
          <p className="uppercase text-xs text-slate-500 tracking-wider mb-1">
            Período evaluado
          </p>
          <p className="font-semibold text-slate-800">{evaluacion.period}</p>
        </div>

        <div>
          <p className="uppercase text-xs text-slate-500 tracking-wider mb-1">
            Fecha de generación
          </p>
          <p className="font-semibold text-slate-800">
            {new Date().toLocaleDateString("es-CL", { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Badge de nivel - posicionado absolutamente */}
      <div 
        className="absolute bottom-8 right-8 px-8 py-6 rounded-2xl shadow-lg"
        style={{ 
          backgroundColor: colorNivel + '15',
          border: `3px solid ${colorNivel}`
        }}
      >
        <p className="text-sm text-slate-600 mb-2">Nivel Ambiental</p>
        <p 
          className="text-5xl font-bold mb-2"
          style={{ color: colorNivel }}
        >
          {Number(evaluacion.finalScore).toFixed(1)}
        </p>
        <p 
          className="text-lg font-semibold uppercase tracking-wide"
          style={{ color: colorNivel }}
        >
          {nivel}
        </p>
      </div>
    </div>
  );
}