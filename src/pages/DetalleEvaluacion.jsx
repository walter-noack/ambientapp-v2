import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEvaluacionById } from "../services/api";
import { Loading } from "../components/shared/ui/Loading";

// Componentes de secciones
import { SeccionPortada } from "../components/detalle/SeccionPortada";
import { SeccionResumen } from "../components/detalle/SeccionResumen";
import { SeccionAnalisis } from "../components/detalle/SeccionAnalisis";
import { SeccionProximosPasos } from "../components/detalle/SeccionProximosPasos";
import { SeccionCarbono } from "../components/detalle/SeccionCarbono";
import { SeccionResiduos } from "../components/detalle/SeccionResiduos";
import { SeccionREP } from "../components/detalle/SeccionREP";

export default function DetalleEvaluacion() {
  const { id } = useParams();
  const [evaluacion, setEvaluacion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const ev = await getEvaluacionById(id);
        setEvaluacion(ev);
      } catch (error) {
        console.error("Error cargando evaluación:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loading size="lg" text="Cargando diagnóstico ambiental..." />
      </div>
    );
  }

  if (!evaluacion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-lg px-8 py-6 rounded-xl">
          <p className="text-red-600">No se pudo cargar la evaluación</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER FIJO CON ACCIONES */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Diagnóstico Ambiental - {evaluacion.companyName}
            </h1>
            <p className="text-sm text-slate-500">Período: {evaluacion.period}</p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors">
              📄 Exportar PDF
            </button>
            
            <Link
              to="/evaluaciones"
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold text-sm transition-colors"
            >
              ← Volver
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        
        {/* PORTADA / HERO */}
        <SeccionPortada evaluacion={evaluacion} />

        {/* RESUMEN EJECUTIVO */}
        <SeccionResumen evaluacion={evaluacion} />

        {/* HUELLA DE CARBONO */}
        <SeccionCarbono 
          alcance1={evaluacion.alcance1 || 15.5}
          alcance2={evaluacion.alcance2 || 8.3}
        />

        {/* GESTIÓN DE RESIDUOS */}
        <SeccionResiduos 
          generados={evaluacion.residuosGenerados || 2500}
          valorizados={evaluacion.residuosValorizados || 1800}
        />

        {/* PRODUCTOS PRIORITARIOS LEY REP */}
        <SeccionREP productosREP={evaluacion.productosREP} />

        {/* ANÁLISIS INTEGRADO */}
        <SeccionAnalisis />

        {/* PRÓXIMOS PASOS */}
        <SeccionProximosPasos />

      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  AmbientApp
                </p>
                <p className="text-xs text-slate-500">
                  Diagnóstico Ambiental Empresarial
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Generado el {new Date().toLocaleDateString("es-CL")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}