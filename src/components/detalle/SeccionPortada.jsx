import { Award, Calendar, Building2, Leaf } from 'lucide-react';

export function SeccionPortada({ evaluacion }) {
  // Determinar nivel y color
  let nivel = "Bajo";
  let colorNivel = "#DC2626";

  if (evaluacion.finalScore >= 75) {
    nivel = "Avanzado";
    colorNivel = "#0068ec";
  } else if (evaluacion.finalScore >= 50) {
    nivel = "Intermedio";
    colorNivel = "#73c91b";
  } else if (evaluacion.finalScore >= 25) {
    nivel = "Básico";
    colorNivel = "#f59e0b";
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg">
      
      {/* Background pattern sutil */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${colorNivel} 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative p-12">
        
        {/* Badge de nivel - esquina superior derecha */}
        <div 
          className="absolute top-8 right-8 px-6 py-4 rounded-xl shadow-lg border-2 bg-white"
          style={{ 
            borderColor: colorNivel
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4" style={{ color: colorNivel }} />
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Nivel Ambiental</p>
          </div>
          <p 
            className="text-3xl font-bold mb-1"
            style={{ color: colorNivel }}
          >
            {Number(evaluacion.finalScore).toFixed(1)}
          </p>
          <p 
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: colorNivel }}
          >
            {nivel}
          </p>
        </div>

        {/* Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Leaf className="w-10 h-10 text-white" />
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

        {/* Metadatos en grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500 tracking-wider mb-1">
                Período evaluado
              </p>
              <p className="font-semibold text-slate-800">{evaluacion.period}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500 tracking-wider mb-1">
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
        </div>

      </div>
    </div>
  );
}