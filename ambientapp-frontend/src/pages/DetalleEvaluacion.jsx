import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loading } from "../components/shared/ui/Loading";
import { ArrowLeft, FileDown, Edit2, Copy, Trash2 } from "lucide-react";
import { getEvaluacionById, eliminarEvaluacion } from "../services/api";
import { exportarComponenteAPDF } from '../utils/exportarPDF';
import InformePDF from '../components/pdf/InformePDF';
import { useAuth } from "../context/AuthContext";


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

  // Estados para PDF
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [mostrarInforme, setMostrarInforme] = useState(false);

  const { user } = useAuth();
  const canExportPDF = user?.features?.exportarPDF === true;

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const response = await getEvaluacionById(id);

        // El backend devuelve { success: true, data: { diagnostico: {...} } }
        const data = response.data?.diagnostico || null;



        setEvaluacion(data);
      } catch (error) {
        console.error('Error:', error);
        setEvaluacion(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);


  // Handler para exportar PDF
  const handleExportarPDF = async () => {
    if (!canExportPDF) {
      alert('Tu Plan Free no permite exportar PDF. Actualiza a Pro para habilitar esta función.');
      return;
    }

    try {
      setGenerandoPDF(true);
      setMostrarInforme(true);

      // Esperar a que se renderice completamente
      await new Promise(resolve => setTimeout(resolve, 2000));

      const companyName = evaluacion?.companyName || 'Empresa';
      const period = evaluacion?.period || 'Periodo';
      const filename = `Diagnostico_Ambiental_${companyName.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.pdf`;

      await exportarComponenteAPDF('pdf-root', filename);

      setTimeout(() => {
        setMostrarInforme(false);
      }, 500);

    } catch (error) {
      console.error('❌ Error al exportar PDF:', error);
      alert('Error al generar el PDF. Por favor intenta nuevamente.');
      setMostrarInforme(false);
    } finally {
      setGenerandoPDF(false);
    }
  };


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

  // ===== PREPARAR DATOS PARA EL PDF =====
  // Datos de carbono del backend
  const alcance1 = Number(evaluacion?.carbono?.emisionesScope1 || 0);
  const alcance2 = Number(evaluacion?.carbono?.emisionesScope2 || 0);
  const totalCarbono = alcance1 + alcance2;

  const emisiones = {
    totalTon: totalCarbono / 1000,
    alcance1: alcance1,
    alcance2: alcance2,
    totalKg: totalCarbono
  };

  // RESIDUOS - del backend
  const residuosTotales = Number(evaluacion?.residuos?.generados || 0);
  const residuosReciclados = Number(evaluacion?.residuos?.valorizados || 0);
  const tasaValorizacion = residuosTotales > 0
    ? ((residuosReciclados / residuosTotales) * 100).toFixed(1)
    : '0';

  // AGUA - del backend
  const consumoAgua = Number(evaluacion?.agua?.consumoTotal || 0);
  const intensidadHidrica = evaluacion?.agua?.consumoPerCapita ? {
    valor: Number(evaluacion.agua.consumoPerCapita),
    unidad: evaluacion.agua.tipoMedicion === 'persona' ? 'L/persona' : 'L/unidad'
  } : null;

  // REP - del backend
  const residuosRep = evaluacion?.productosREP || [];

  // SCORES - del backend (usar puntuaciones reales)
  const carbonScore = Number(evaluacion?.carbono?.puntuacion || 0);
  const waterScore = Number(evaluacion?.agua?.puntuacion || 0);
  const wasteScore = Number(evaluacion?.residuos?.puntuacion || 0);
  const puntajeGlobal = Number(evaluacion?.puntuacionGeneral || 0);

  // TEXTOS INTERPRETATIVOS
  const textoRadar = `El perfil ambiental muestra un mejor desempeño en gestión hídrica (${waterScore} pts), mientras que la principal oportunidad de mejora se encuentra en huella de carbono (${carbonScore} pts).`;

  const textoCarbono = `La huella total es de ${(totalCarbono / 1000).toFixed(2)} tCO₂e. ${alcance1 > alcance2
    ? `${((alcance1 / totalCarbono) * 100).toFixed(1)}% corresponde a combustibles (Alcance 1) y ${((alcance2 / totalCarbono) * 100).toFixed(1)}% a electricidad (Alcance 2).`
    : `${((alcance2 / totalCarbono) * 100).toFixed(1)}% corresponde a electricidad (Alcance 2) y ${((alcance1 / totalCarbono) * 100).toFixed(1)}% a combustibles (Alcance 1).`
    } La mayor contribución proviene de ${alcance1 > alcance2 ? 'combustibles (Alcance 1)' : 'electricidad (Alcance 2)'}.`;

  const textoRep = residuosRep.length > 0
    ? `Para el año ${evaluacion.anio}, el porcentaje promedio de valorización es ${tasaValorizacion}%. Considerando ${residuosTotales.toLocaleString('es-CL')} kg de residuos, la gestión REP requiere seguimiento anual.`
    : 'No se registraron productos prioritarios sujetos a Ley REP para el período evaluado.';

  const nivelGlobal = evaluacion?.nivelDesempeno || 'Básico';
  const textoGlobal = `El puntaje global es ${puntajeGlobal}/100 (nivel ${nivelGlobal}). Se recomienda mantener seguimiento anual a metas de valorización REP.`;

  // Preparar objeto evaluacion adaptado para InformePDF
  const evaluacionParaPDF = {
    ...evaluacion,

    // Construir period del backend
    period: `${evaluacion?.semestre}-${evaluacion?.anio}`,

    // Estructura esperada por InformePDF
    waterData: {
      consumoMensual: consumoAgua,
      intensidadHidrica: intensidadHidrica
    },

    wasteData: {
      residuosTotales: residuosTotales,
      residuosReciclados: residuosReciclados
    },

    // Agregar alcances para compatibilidad
    alcance1: alcance1,
    alcance2: alcance2,

    // Scores para compatibilidad
    scores: {
      carbonScore: carbonScore,
      waterScore: waterScore,
      wasteScore: wasteScore
    },

    finalScore: puntajeGlobal
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
            <p className="text-sm text-slate-500">  Período: {evaluacion.semestre}-{evaluacion.anio}</p>
          </div>

          <div className="flex items-start gap-4">
            {/* Bloque Exportar PDF (botón + mensaje) */}
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleExportarPDF}
                disabled={generandoPDF || !canExportPDF}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${generandoPDF
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : canExportPDF
                      ? "bg-primary-600 hover:bg-primary-700 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                title={
                  canExportPDF
                    ? "Exportar PDF"
                    : "Función disponible sólo para el Plan Pro"
                }
              >
                {generandoPDF ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    <span>Exportar PDF</span>
                  </>
                )}
              </button>

              {!canExportPDF && (
                <p className="text-[11px] text-slate-400 text-right">
                  Función disponible sólo para el{" "}
                  <span className="font-semibold">Plan Pro</span>.
                </p>
              )}
            </div>

            {/* Bloque de botones de acciones alineados */}
            <div className="flex items-center gap-2">
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
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* PORTADA / HERO */}
        <SeccionPortada evaluacion={evaluacion} />

        {/* RESUMEN EJECUTIVO */}
        <SeccionResumen evaluacion={evaluacion} />

        {/* HUELLA DE CARBONO */}
        <SeccionCarbono
          alcance1={alcance1}
          alcance2={alcance2}
        />

        {/* GESTIÓN DEL AGUA */}
        <SeccionAgua
          consumoAgua={consumoAgua}
          intensidadHidrica={intensidadHidrica}
        />

        {/* GESTIÓN DE RESIDUOS */}
        <SeccionResiduos
          generados={residuosTotales}
          valorizados={residuosReciclados}
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

      {/* 
        COMPONENTE PDF OCULTO
        Solo se renderiza cuando se genera el PDF
      */}
      {mostrarInforme && (
        <div
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '800px',
            zIndex: -1
          }}
        >
          <InformePDF
            evaluacion={evaluacionParaPDF}  // ← Usar evaluacionParaPDF
            emisiones={emisiones}
            residuosRep={residuosRep}
            textoRadar={textoRadar}
            textoCarbono={textoCarbono}
            textoRep={textoRep}
            textoGlobal={textoGlobal}
            radarImg={null}
            stackedImg={null}
            recomendaciones={[]}
            factores={[]}
          />
        </div>
      )}
    </div>
  );
}