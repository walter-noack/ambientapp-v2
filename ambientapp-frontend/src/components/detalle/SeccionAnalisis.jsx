import { Target, TrendingUp, AlertCircle, CheckCircle2, Lightbulb, Zap, Clock } from 'lucide-react';
import { generarRecomendacionesIntegradas } from '../../utils/recomendaciones';

export function SeccionAnalisis({ evaluacion }) {
  const { carbonScore = 0, waterScore = 0, wasteScore = 0 } = evaluacion.scores || {};

  // Analizar fortalezas (puntaje >= 70)
  const fortalezas = [];
  if (carbonScore >= 70) fortalezas.push({ nombre: 'Huella de Carbono', puntaje: carbonScore });
  if (waterScore >= 70) fortalezas.push({ nombre: 'Gestión del Agua', puntaje: waterScore });
  if (wasteScore >= 70) fortalezas.push({ nombre: 'Gestión de Residuos', puntaje: wasteScore });

// Analizar áreas de mejora (puntaje < 70)
const mejoras = [];
if (carbonScore < 70) mejoras.push({ nombre: 'Huella de Carbono', puntaje: carbonScore });
if (waterScore < 70) mejoras.push({ nombre: 'Gestión del Agua', puntaje: waterScore });
if (wasteScore < 70) mejoras.push({ nombre: 'Gestión de Residuos', puntaje: wasteScore });

  // Identificar prioridad crítica (puntaje más bajo)
  const dimensiones = [
    { nombre: 'Carbono', puntaje: carbonScore },
    { nombre: 'Agua', puntaje: waterScore },
    { nombre: 'Residuos', puntaje: wasteScore }
  ];
  const prioridad = dimensiones.sort((a, b) => a.puntaje - b.puntaje)[0];

  // Generar recomendaciones personalizadas
  const recomendaciones = generarRecomendacionesIntegradas(evaluacion);

  // Configuración de colores por prioridad
  const prioridadConfig = {
    'alta': {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      badgeBg: 'bg-red-500/20',
      badgeText: 'text-red-300',
      icon: AlertCircle
    },
    'media': {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300',
      icon: TrendingUp
    },
    'baja': {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      badgeBg: 'bg-blue-500/20',
      badgeText: 'text-blue-300',
      icon: Lightbulb
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-xl text-white border border-slate-700">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">
          Análisis Integrado y Recomendaciones
        </h2>
        <p className="text-slate-300">
          Diagnóstico estratégico con plan de acción personalizado
        </p>
      </div>

      <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-6">
        <p className="text-slate-100 leading-relaxed">
          Este análisis integra los resultados de las tres dimensiones ambientales evaluadas 
          y genera un plan de acción personalizado basado en tus datos reales de operación.
        </p>
      </div>

      {/* Grid de análisis */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        
        {/* FORTALEZAS */}
        <div className="p-5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-emerald-400 uppercase tracking-wide font-semibold">
                Fortalezas
              </p>
              <p className="text-lg font-bold text-white">{fortalezas.length}</p>
            </div>
          </div>
          {fortalezas.length > 0 ? (
            <ul className="space-y-2">
              {fortalezas.map((f, idx) => (
                <li key={idx} className="text-sm text-emerald-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span>{f.nombre} ({f.puntaje}%)</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">Sin fortalezas destacadas aún</p>
          )}
        </div>

        {/* ÁREAS DE MEJORA */}
        <div className="p-5 bg-amber-500/10 rounded-xl border border-amber-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-amber-400 uppercase tracking-wide font-semibold">
                Áreas de Mejora
              </p>
              <p className="text-lg font-bold text-white">{mejoras.length}</p>
            </div>
          </div>
          {mejoras.length > 0 ? (
            <ul className="space-y-2">
              {mejoras.map((m, idx) => (
                <li key={idx} className="text-sm text-amber-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span>{m.nombre} ({m.puntaje}%)</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">Todas las áreas en nivel aceptable</p>
          )}
        </div>

        {/* PRIORIDAD CRÍTICA */}
        <div className="p-5 bg-red-500/10 rounded-xl border border-red-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-red-400 uppercase tracking-wide font-semibold">
                Foco Prioritario
              </p>
            </div>
          </div>
          <p className="text-sm text-red-100 mb-2">
            <strong>{prioridad.nombre}</strong>
          </p>
          <p className="text-xs text-slate-300">
            Dimensión con menor puntaje ({prioridad.puntaje}%). Requiere atención inmediata.
          </p>
        </div>
      </div>

      {/* RECOMENDACIONES PERSONALIZADAS */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              Plan de Acción Personalizado
            </h3>
            <p className="text-sm text-slate-300">
              {recomendaciones.length} recomendaciones basadas en tus datos reales
            </p>
          </div>
        </div>

        {/* Lista de recomendaciones */}
        <div className="space-y-4">
          {recomendaciones.map((rec, idx) => {
            const config = prioridadConfig[rec.prioridad];
            const IconComponent = config.icon;

            return (
              <div
                key={idx}
                className={`p-5 rounded-xl border ${config.bg} ${config.border}`}
              >
                {/* Header de recomendación */}
                <div className="flex items-start gap-4 mb-3">
                  <div className={`flex-shrink-0 w-10 h-10 ${config.badgeBg} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${config.text}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-bold text-white text-lg leading-tight">
                        {rec.titulo}
                      </h4>
                      <span className={`flex-shrink-0 px-3 py-1 ${config.badgeBg} ${config.badgeText} rounded-lg text-xs font-semibold uppercase tracking-wide`}>
                        {rec.prioridad}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed mb-3">
                      {rec.descripcion}
                    </p>
                    
                    {/* Footer con impacto y plazo */}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide">Impacto estimado</p>
                          <p className="text-sm text-slate-100 font-medium">{rec.impacto}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide">Plazo sugerido</p>
                          <p className="text-sm text-slate-100 font-medium">{rec.plazo}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}