import { Users, Target, Calendar, BarChart3, RefreshCw, CheckCircle2 } from 'lucide-react';

export function SeccionProximosPasos() {
  const pasos = [
    {
      icon: Users,
      texto: "Socializar este diagnóstico con el equipo de sostenibilidad"
    },
    {
      icon: Target,
      texto: "Priorizar acciones según impacto ambiental y facilidad de implementación"
    },
    {
      icon: Calendar,
      texto: "Establecer cronograma de implementación con hitos claros"
    },
    {
      icon: BarChart3,
      texto: "Realizar seguimiento trimestral del progreso en cada dimensión"
    },
    {
      icon: RefreshCw,
      texto: "Actualizar diagnóstico anualmente para medir evolución"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 shadow-lg border-2 border-primary-200">
      
      {/* Línea decorativa lateral */}
      <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-primary-500 to-accent-500 rounded-r-full" />

      <div className="ml-4">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Próximos Pasos
            </h2>
            <p className="text-slate-600">
              Ruta sugerida para implementar las mejoras identificadas
            </p>
          </div>
        </div>

        <ul className="space-y-4">
          {pasos.map((paso, idx) => {
            const Icon = paso.icon;
            return (
              <li key={idx} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md border-2 border-primary-200">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {paso.texto}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}