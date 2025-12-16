// src/pages/About.jsx
import { useNavigate } from 'react-router-dom';
import {
  Leaf,
  Droplets,
  Recycle,
  BarChart3,
  FileText,
  Target,
  CheckCircle,
  ArrowRight,
  Globe,
  Building2,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Storytelling */}
        <div className="text-center mb-16">
          <p className="text-green-600 font-semibold text-lg mb-4">
            ¿Cómo mejorar la gestión ambiental de tu empresa?
          </p>

          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Mide tu Desempeño Ambiental
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 mt-2">
              De Forma Simple y Rápida
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
            AmbientApp traduce datos complejos en <strong>diagnósticos claros y accionables</strong>.
            Creado para empresas que quieren entender y mejorar sus indicadores ambientales
            <span className="text-green-600 font-semibold"> hoy mismo</span>.
          </p>
        </div>

        {/* ¿Qué evaluamos? */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Qué evalúa AmbientApp?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Huella de Carbono */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                Huella de Carbono
              </h4>
              <p className="text-gray-600 mb-4">
                Estimación rápida de las emisiones de gases de efecto invernadero
                (Alcance 1 y 2) de tu organización.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Alcance 1: Emisiones directas (combustión)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Alcance 2: Energía eléctrica adquirida</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-500 italic">Basado en factores IPCC y MMA Chile</span>
                </li>
              </ul>
            </div>

            {/* Análisis de Consumo Hídrico */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Droplets className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                Análisis de Consumo Hídrico
              </h4>
              <p className="text-gray-600 mb-4">
                Estimación del consumo anual de agua y clasificación según
                intensidad por tipo de actividad.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Consumo por fuente (red pública, pozos, otros)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Eficiencia hídrica básica</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Clasificación por intensidad sectorial</span>
                </li>
              </ul>
            </div>

            {/* Gestión de Residuos */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Recycle className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                Gestión de Residuos
              </h4>
              <p className="text-gray-600 mb-4">
                Proporción entre residuos generados y valorizados, integrando
                conceptos de economía circular y Ley REP.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Clasificación por tipo de residuo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Cumplimiento inicial Ley REP Chile</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Tasas de valorización y reciclaje</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Marcos de Referencia - Movido aquí */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 mb-20 text-white">
          <h3 className="text-3xl font-bold text-center mb-8">
            Marcos de Referencia
          </h3>
          <p className="text-center text-green-100 mb-10 max-w-2xl mx-auto">
            Nuestra evaluación se basa en metodologías y lineamientos reconocidos
            internacionalmente y adaptados al contexto chileno
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white/20 rounded-lg p-6 mb-4">
                <Globe className="w-12 h-12 mx-auto" />
              </div>
              <h5 className="font-bold mb-2">GHG Protocol</h5>
              <p className="text-sm text-green-100">
                Estándar internacional para el cálculo de huella de carbono para organizaciones
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-lg p-6 mb-4">
                <Building2 className="w-12 h-12 mx-auto" />
              </div>
              <h5 className="font-bold mb-2">MMA Chile 2023</h5>
              <p className="text-sm text-green-100">
                Factores de Emisión para Huella de Carbono según Ministerio del Medio Ambiente
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-lg p-6 mb-4">
                <Recycle className="w-12 h-12 mx-auto" />
              </div>
              <h5 className="font-bold mb-2">Ley REP Chile</h5>
              <p className="text-sm text-green-100">
                Responsabilidad Extendida del Productor
              </p>
            </div>
          </div>
        </div>

        {/* Escala de Evaluación - Más esquemática */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Escala de Evaluación
          </h3>

          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            AmbientApp clasifica el desempeño ambiental en cuatro niveles según el puntaje obtenido
          </p>

          {/* Versión esquemática y compacta */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Nivel 1 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-red-500">
                <div className="bg-red-50 p-4 text-center">
                  <h4 className="font-bold text-red-700 text-xl">Nivel 1</h4>
                  <p className="text-3xl font-bold text-red-600 my-2">0-29</p>
                  <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    Bajo
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Sin mediciones. Registros mínimos. Gestión reactiva ante incidentes.
                  </p>
                </div>
              </div>

              {/* Nivel 2 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-rose-500">
                <div className="bg-rose-50 p-4 text-center">
                  <h4 className="font-bold text-rose-700 text-xl">Nivel 2</h4>
                  <p className="text-3xl font-bold text-rose-600 my-2">30-59</p>
                  <span className="inline-block bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">
                    Básico
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Prácticas iniciales. Mediciones parciales. Sin estrategia integral.
                  </p>
                </div>
              </div>

              {/* Nivel 3 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-amber-500">
                <div className="bg-amber-50 p-4 text-center">
                  <h4 className="font-bold text-amber-700 text-xl">Nivel 3</h4>
                  <p className="text-3xl font-bold text-amber-600 my-2">60-79</p>
                  <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                    Intermedio
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Procesos formales. Registros periódicos. Gestión proactiva.
                  </p>
                </div>
              </div>

              {/* Nivel 4 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-sky-500">
                <div className="bg-sky-50 p-4 text-center">
                  <h4 className="font-bold text-sky-700 text-xl">Nivel 4</h4>
                  <p className="text-3xl font-bold text-sky-600 my-2">80-100</p>
                  <span className="inline-block bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium">
                    Avanzado
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Sostenibilidad integrada. Métricas avanzadas. Cultura ambiental.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>


        {/* Aviso Importante - Color Anaranjado */}
        <div className="mb-16 max-w-4xl mx-auto">
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg shadow-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-orange-900 mb-2">Aviso Importante</h4>
                <p className="text-orange-800 text-sm">
                  AmbientApp <strong>NO sustituye</strong> inventarios oficiales de gases de efecto invernadero,
                  reportes ESG, diagnósticos normativos ni auditorías ambientales. Las estimaciones
                  <strong> NO representan inventarios certificados</strong> ni cumplen requisitos de reportabilidad
                  para estándares como ISO 14064, GHG Protocol o certificaciones ESG. Su propósito es
                  educativo y orientado a toma de decisiones preliminares.
                </p>
              </div>
            </div>
          </div>
        </div>

        
        {/* CTA Final */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            ¿Listo para evaluar el desempeño ambiental de tu empresa?
          </h3>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Comienza tu diagnóstico inicial hoy y descubre oportunidades de mejora
          </p>
          <button
            onClick={() => navigate('/evaluaciones')}
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors inline-flex items-center gap-2"
          >
            Comenzar Evaluación
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            Desarrollado por @mellamowalter.cl — 2025
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2024 AmbientApp - Chile 🇨🇱
          </p>
        </div>
      </footer>
    </div>
  );
}