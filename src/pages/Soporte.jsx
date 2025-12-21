import { useState } from 'react';
import { Mail, Phone, HelpCircle } from 'lucide-react';

function Soporte() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqs = [
    {
      pregunta: "¿Cómo inicio un nuevo diagnóstico ambiental?",
      respuesta: "Desde el Dashboard, haz clic en 'Nueva Evaluación'. Completa la información general de la empresa y selecciona las dimensiones que deseas evaluar (Huella de Carbono, Consumo de Agua y/o Gestión de Residuos). Luego, completa los datos solicitados para cada dimensión."
    },
    {
      pregunta: "¿Puedo evaluar solo una dimensión ambiental?",
      respuesta: "Sí, cada dimensión es opcional. Puedes evaluar solo Huella de Carbono, solo Agua, solo Residuos, o cualquier combinación de las tres según las necesidades de tu cliente."
    },
    {
      pregunta: "¿De dónde provienen los factores de emisión utilizados?",
      respuesta: "Utilizamos los factores de emisión oficiales del Ministerio del Medio Ambiente de Chile, actualización 2023. Estos factores están alineados con el GHG Protocol y las normas ISO 14064."
    },
    {
      pregunta: "¿Cómo interpreto la escala de evaluación?",
      respuesta: "La escala va de 0 a 100 puntos y se divide en cuatro niveles: Bajo (0-29), Básico (30-59), Intermedio (60-79) y Avanzado (80-100). Cada nivel refleja el grado de desarrollo de las prácticas de gestión ambiental de la empresa."
    },
    {
      pregunta: "¿Puedo editar un diagnóstico después de guardarlo?",
      respuesta: "Sí, desde la lista de evaluaciones puedes seleccionar cualquier diagnóstico y editarlo. También puedes duplicar evaluaciones existentes para crear nuevas versiones o comparar períodos."
    },
    {
      pregunta: "¿Cómo descargo el reporte en PDF?",
      respuesta: "En el detalle de cada evaluación encontrarás el botón 'Descargar PDF'. El reporte incluye todos los datos ingresados, cálculos realizados, gráficos y la escala de evaluación."
    },
    {
      pregunta: "¿Qué son los productos REP?",
      respuesta: "Son productos sujetos a la Ley 20.920 de Responsabilidad Extendida del Productor: envases y embalajes, aparatos eléctricos y electrónicos, baterías, neumáticos y aceites lubricantes. Los productores de estos productos tienen obligaciones específicas de valorización."
    },
    {
      pregunta: "¿Cuál es la diferencia entre Alcance 1 y Alcance 2?",
      respuesta: "Alcance 1 son emisiones directas de fuentes controladas por la empresa (combustibles, vehículos propios). Alcance 2 son emisiones indirectas por consumo de electricidad y energía comprada. Consulta la sección de Metodología en Documentación para más detalles."
    },
    {
      pregunta: "¿Los datos de mis clientes están seguros?",
      respuesta: "Sí, toda la información se almacena de forma segura con encriptación. Cada usuario solo tiene acceso a sus propias evaluaciones. Cumplimos con estándares de seguridad y privacidad de datos."
    },
    {
      pregunta: "¿Puedo exportar los datos a Excel?",
      respuesta: "Actualmente el sistema genera reportes en PDF. La funcionalidad de exportación a Excel está en desarrollo y estará disponible próximamente."
    },
    {
      pregunta: "¿Cómo puedo comparar el desempeño entre diferentes períodos?",
      respuesta: "Puedes duplicar una evaluación existente y actualizar los datos para el nuevo período. Los gráficos en el dashboard te permitirán visualizar la evolución del desempeño ambiental en el tiempo."
    },
    {
      pregunta: "¿Qué información necesito para completar la Huella de Carbono?",
      respuesta: "Necesitas datos de consumo de electricidad (kWh), combustibles utilizados (litros o m³), y consumo de gases refrigerantes si aplica. El sistema calculará automáticamente las emisiones usando los factores oficiales de Chile."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Soporte</h1>
          <p className="text-gray-600">
            Estamos aquí para ayudarte. Consulta las preguntas frecuentes o contáctanos directamente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: FAQ */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Preguntas Frecuentes</h2>
              </div>
              
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                      className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-900">{faq.pregunta}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          activeQuestion === index ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeQuestion === index && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-600 text-sm">{faq.respuesta}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  ¿No encuentras la respuesta a tu pregunta? Contáctanos directamente usando la información a la derecha.
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha: Información de contacto */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contacto</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Email de soporte</p>
                    <a
                      href="mailto:soporte@ambientapp.cl"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      soporte@ambientapp.cl
                    </a>
                    <p className="text-xs text-gray-500 mt-1">
                      Respondemos en 24-48 hrs hábiles
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Horario de atención</p>
                    <p className="text-gray-600 text-sm">
                      Lunes a Viernes<br />
                      9:00 - 18:00 hrs (Chile)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Al contactarnos, incluye:</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Nombre de tu empresa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Tipo de diagnóstico o consulta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Descripción detallada del problema</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Capturas de pantalla si aplica</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Recursos adicionales</h3>
                <div className="space-y-2">
                  <a
                    href="/documentacion"
                    className="block text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    → Ver Documentación técnica
                  </a>
                  <a
                    href="/acerca-de"
                    className="block text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    → Acerca de AmbientApp
                  </a>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Para una respuesta más rápida, revisa primero nuestra 
                  sección de Preguntas Frecuentes y la Documentación técnica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Soporte;