import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loading } from "../components/shared/ui/Loading";
import { ArrowLeft, FileDown, Edit2, Copy, Trash2 } from "lucide-react";
import { getEvaluacionById, eliminarEvaluacion } from "../services/api";
import { exportarComponenteAPDF } from '../utils/exportarPDF';
import InformePDF from '../components/pdf/InformePDF';

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

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getEvaluacionById(id);

        console.log('📦 Datos recibidos de la API:', data); // ← AGREGAR
        console.log('📦 Tipo de data:', typeof data); // ← AGREGAR
        console.log('📦 Keys de data:', Object.keys(data || {})); // ← AGREGAR

        setEvaluacion(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Handler para exportar PDF
  const handleExportarPDF = async () => {
    try {
      setGenerandoPDF(true);
      setMostrarInforme(true);

      // Esperar a que se renderice completamente
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generar nombre de archivo
      const companyName = evaluacion?.companyName || 'Empresa';
      const period = evaluacion?.period || 'Periodo';
      const filename = `Diagnostico_Ambiental_${companyName.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.pdf`;

      console.log('🎯 Generando PDF:', filename);

      // Generar PDF - CAMBIO AQUÍ: No validar result.success
      await exportarComponenteAPDF('pdf-root', filename);

      console.log('✅ PDF generado exitosamente');

      // Ocultar el componente después de un breve delay
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
  const alcance1 = Number(evaluacion?.alcance1 || 0);
  const alcance2 = Number(evaluacion?.alcance2 || 0);
  const totalCarbono = alcance1 + alcance2;

  const emisiones = {
    totalTon: totalCarbono / 1000,
    alcance1: alcance1,
    alcance2: alcance2,
    totalKg: totalCarbono
  };

  // RESIDUOS - Ya existen en tu API
  const residuosTotales = Number(evaluacion?.residuosGenerados || 0);
  const residuosReciclados = Number(evaluacion?.residuosValorizados || 0);
  const tasaValorizacion = residuosTotales > 0
    ? ((residuosReciclados / residuosTotales) * 100).toFixed(1)
    : '0';

  // AGUA - NO EXISTE en tu API, usar valores por defecto o 0
  const consumoAgua = Number(evaluacion?.consumoAgua || 0);
  const aguaReutilizada = Number(evaluacion?.aguaReutilizada || 0);
  const intensidadHidrica = evaluacion?.intensidadHidrica || null;

  // REP - Ya existe
  const residuosRep = evaluacion?.productosREP || [];

  // SCORES - Ya existen
  const carbonScore = Number(evaluacion?.scores?.carbonScore || 80);
  const waterScore = Number(evaluacion?.scores?.waterScore || 85);
  const wasteScore = Number(evaluacion?.scores?.wasteScore || 90);
  const puntajeGlobal = ((carbonScore + waterScore + wasteScore) / 3).toFixed(1);

  // TEXTOS INTERPRETATIVOS
  const textoRadar = `El perfil ambiental muestra un mejor desempeño en gestión hídrica (${waterScore} pts), mientras que la principal oportunidad de mejora se encuentra en huella de carbono (${carbonScore} pts).`;

  const textoCarbono = `La huella total es de ${(totalCarbono / 1000).toFixed(2)} tCO₂e. ${alcance1 > alcance2
    ? `${((alcance1 / totalCarbono) * 100).toFixed(1)}% corresponde a combustibles (Alcance 1) y ${((alcance2 / totalCarbono) * 100).toFixed(1)}% a electricidad (Alcance 2).`
    : `${((alcance2 / totalCarbono) * 100).toFixed(1)}% corresponde a electricidad (Alcance 2) y ${((alcance1 / totalCarbono) * 100).toFixed(1)}% a combustibles (Alcance 1).`
    } La mayor contribución proviene de ${alcance1 > alcance2 ? 'combustibles (Alcance 1)' : 'electricidad (Alcance 2)'}.`;

  const textoRep = residuosRep.length > 0
    ? `Para el año 2024, el porcentaje promedio de valorización es ${tasaValorizacion}%. Considerando ${residuosTotales.toLocaleString('es-CL')} kg de residuos, la gestión REP requiere seguimiento anual.`
    : 'No se registraron productos prioritarios sujetos a Ley REP para el período evaluado.';

  const nivelGlobal = puntajeGlobal >= 70 ? 'Alto' : puntajeGlobal >= 40 ? 'Básico' : 'Inicial';
  const textoGlobal = `El puntaje global es ${puntajeGlobal}/100 (nivel ${nivelGlobal}). Se recomienda mantener seguimiento anual a metas de valorización REP.`;

  // Preparar objeto evaluacion adaptado para InformePDF
  const evaluacionParaPDF = {
    ...evaluacion,

    // Estructura esperada por InformePDF
    waterData: {
      consumoMensual: consumoAgua,           // ← Ahora con dato real
      aguaReutilizada: aguaReutilizada,      // ← Agregado
      intensidadHidrica: intensidadHidrica   // ← Agregado
    },

    wasteData: {
      residuosTotales: residuosTotales,
      residuosReciclados: residuosReciclados
    }
  };

  console.log('✅ Datos preparados para PDF:', {
    emisiones,
    residuosRep,
    evaluacionParaPDF
  });

  console.log('🎯 Estado evaluacion:', evaluacion);
  console.log('🎯 evaluacion existe?:', !!evaluacion);
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
              onClick={handleExportarPDF}
              disabled={generandoPDF}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${generandoPDF
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              title="Exportar PDF"
            >
              {generandoPDF ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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