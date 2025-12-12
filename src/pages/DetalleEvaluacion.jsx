import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loading } from "../components/shared/ui/Loading";
import { ArrowLeft, FileDown, Edit2, Copy, Trash2 } from "lucide-react";
import { getEvaluacionById, eliminarEvaluacion } from "../services/api";

// Componentes de secciones
import { SeccionPortada } from "../components/detalle/SeccionPortada";
import { SeccionResumen } from "../components/detalle/SeccionResumen";
import { SeccionCarbono } from "../components/detalle/SeccionCarbono";
import { SeccionResiduos } from "../components/detalle/SeccionResiduos";
import { SeccionAnalisis } from "../components/detalle/SeccionAnalisis";
import { SeccionProximosPasos } from "../components/detalle/SeccionProximosPasos";
import { SeccionREP } from "../components/detalle/SeccionREP";
import { SeccionAgua } from "../components/detalle/SeccionAgua";

export default function DetalleEvaluacion() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleDuplicar = () => {
    if (window.confirm('¿Deseas duplicar esta evaluación?')) {
      navigate(`/evaluaciones/duplicar/${id}`);
    }
  };

  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro de eliminar esta evaluación? Esta acción no se puede deshacer.')) {
      try {
        await eliminarEvaluacion(id);
        alert('Evaluación eliminada correctamente');
        navigate('/dashboard');
      } catch (error) {
        alert('Error al eliminar la evaluación. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER FIJO */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Diagnóstico Ambiental - {evaluacion.companyName}
            </h1>
            <p className="text-sm text-slate-500">Período: {evaluacion.period}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Exportar PDF */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors"
              title="Exportar PDF"
            >
              <FileDown className="w-4 h-4" />
              <span>Exportar PDF</span>
            </button>

            {/* Editar */}
            <Link
              to={`/evaluaciones/editar/${id}`}
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-sm"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </Link>

            {/* Duplicar */}
            <button
              onClick={handleDuplicar}
              className="inline-flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-semibold text-sm"
              title="Duplicar"
            >
              <Copy className="w-4 h-4" />
            </button>

            {/* Eliminar */}
            <button
              onClick={handleEliminar}
              className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold text-sm"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Volver */}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold text-sm transition-colors"
              title="Volver al dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
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

        {/* GESTIÓN DEL AGUA */}
        <SeccionAgua evaluacion={evaluacion} />

        {/* GESTIÓN DE RESIDUOS */}
        <SeccionResiduos
          generados={evaluacion.residuosGenerados || 2500}
          valorizados={evaluacion.residuosValorizados || 1800}
        />

        {/* PRODUCTOS PRIORITARIOS LEY REP */}
        <SeccionREP productosREP={evaluacion.productosREP} />

        {/* ANÁLISIS INTEGRADO */}
        <SeccionAnalisis evaluacion={evaluacion} />

        {/* PRÓXIMOS PASOS */}
        <SeccionProximosPasos />

      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              © {new Date().getFullYear()} AmbientApp - Diagnóstico Ambiental Empresarial
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