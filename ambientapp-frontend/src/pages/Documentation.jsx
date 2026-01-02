import { useState } from 'react';
import { BookOpen, FileText, List } from 'lucide-react';

function Documentation() {
  const [activeTab, setActiveTab] = useState('guia');

  const tabs = [
    { id: 'guia', label: 'Guía de Uso', icon: BookOpen },
    { id: 'metodologia', label: 'Metodología Técnica', icon: FileText },
    { id: 'glosario', label: 'Glosario', icon: List }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentación</h1>
          <p className="text-gray-600">
            Información técnica y guías de uso para AmbientApp
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'guia' && <GuiaUso />}
            {activeTab === 'metodologia' && <MetodologiaTecnica />}
            {activeTab === 'glosario' && <Glosario />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente: Guía de Uso
function GuiaUso() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Guía de Uso</h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Cómo completar el diagnóstico</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">1. Información General</h4>
            <p className="text-gray-600">
              Ingrese los datos básicos de la empresa: nombre, RUT, dirección, contacto y sector productivo.
              Esta información permite contextualizar los resultados del diagnóstico.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">2. Selección de Dimensiones</h4>
            <p className="text-gray-600">
              Elija las dimensiones ambientales que desea evaluar. Puede seleccionar una o todas:
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
              <li><strong>Huella de Carbono:</strong> Evalúa emisiones de GEI (Alcance 1 y 2)</li>
              <li><strong>Consumo de Agua:</strong> Analiza el uso y gestión del recurso hídrico</li>
              <li><strong>Gestión de Residuos:</strong> Evalúa manejo, valorización y disposición de residuos</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">3. Completar Información por Dimensión</h4>
            <p className="text-gray-600">
              Para cada dimensión seleccionada, complete los campos requeridos con datos reales y verificables.
              Los cálculos se realizan automáticamente usando factores oficiales del Ministerio del Medio Ambiente.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">4. Revisar y Guardar</h4>
            <p className="text-gray-600">
              Revise todos los datos ingresados antes de guardar. Puede editar el diagnóstico posteriormente
              desde el dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Escala de Evaluación</h3>
        <p className="text-gray-600 mb-4">
          El desempeño ambiental se evalúa en una escala de 0 a 100 puntos, dividida en cuatro niveles:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-semibold text-red-800">Bajo (0-29 puntos)</span>
            </div>
            <p className="text-sm text-gray-700">
              Desempeño inicial. Se requiere implementar medidas básicas de gestión ambiental.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-semibold text-yellow-800">Básico (30-59 puntos)</span>
            </div>
            <p className="text-sm text-gray-700">
              Gestión ambiental en desarrollo. Existen prácticas básicas pero hay oportunidades de mejora.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-semibold text-blue-800">Intermedio (60-79 puntos)</span>
            </div>
            <p className="text-sm text-gray-700">
              Buen desempeño ambiental. Sistemas de gestión implementados con margen de optimización.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-800">Avanzado (80-100 puntos)</span>
            </div>
            <p className="text-sm text-gray-700">
              Excelente desempeño. Gestión ambiental integral con mejora continua y certificaciones.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Interpretación del Dashboard</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">KPIs Principales</h4>
            <p className="text-gray-600">
              Los indicadores clave muestran el desempeño general y por dimensión evaluada. 
              Compare su puntaje con el promedio de su sector para identificar áreas de mejora.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Gráficos de Tendencia</h4>
            <p className="text-gray-600">
              Los gráficos históricos permiten visualizar la evolución del desempeño ambiental en el tiempo,
              facilitando el seguimiento de metas y objetivos ambientales.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Reporte PDF</h4>
            <p className="text-gray-600">
              Descargue reportes detallados con todos los datos, cálculos y recomendaciones para
              presentación a stakeholders o uso interno.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Componente: Metodología Técnica
function MetodologiaTecnica() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Metodología Técnica</h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Huella de Carbono</h3>
        
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">Alcances según GHG Protocol</h4>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="font-semibold text-gray-800 mb-2">Alcance 1 - Emisiones Directas</p>
            <p className="text-gray-600 text-sm mb-2">
              Emisiones de fuentes que son propiedad o están controladas por la organización.
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm ml-4">
              <li>Combustión estacionaria (calderas, generadores)</li>
              <li>Combustión móvil (vehículos de la empresa)</li>
              <li>Emisiones fugitivas (refrigerantes, gases)</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-semibold text-gray-800 mb-2">Alcance 2 - Emisiones Indirectas por Energía</p>
            <p className="text-gray-600 text-sm mb-2">
              Emisiones derivadas de la generación de electricidad, calor o vapor comprado y consumido.
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm ml-4">
              <li>Consumo de electricidad de la red</li>
              <li>Calor o vapor comprado para procesos</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">Fórmula General de Cálculo</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-mono text-sm text-gray-800 mb-2">
              Emisiones (tCO₂eq) = Dato de Actividad × Factor de Emisión
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Donde:
            </p>
            <ul className="list-disc list-inside text-xs text-gray-600 ml-4 mt-1">
              <li><strong>Dato de Actividad:</strong> Cantidad de combustible, electricidad o gas consumido</li>
              <li><strong>Factor de Emisión:</strong> kgCO₂eq por unidad de consumo (según fuente oficial)</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Factores de Emisión (Chile 2023)</h4>
          <p className="text-sm text-gray-600 mb-3">
            Fuente: Ministerio del Medio Ambiente de Chile, actualización 2023
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left">Fuente</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Unidad</th>
                  <th className="border border-gray-200 px-4 py-2 text-right">Factor (kgCO₂eq)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Electricidad (SIC)</td>
                  <td className="border border-gray-200 px-4 py-2">kWh</td>
                  <td className="border border-gray-200 px-4 py-2 text-right">0,273</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">Diésel</td>
                  <td className="border border-gray-200 px-4 py-2">litro</td>
                  <td className="border border-gray-200 px-4 py-2 text-right">2,687</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Gasolina</td>
                  <td className="border border-gray-200 px-4 py-2">litro</td>
                  <td className="border border-gray-200 px-4 py-2 text-right">2,330</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">Gas Natural</td>
                  <td className="border border-gray-200 px-4 py-2">m³</td>
                  <td className="border border-gray-200 px-4 py-2 text-right">1,960</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">GLP</td>
                  <td className="border border-gray-200 px-4 py-2">kg</td>
                  <td className="border border-gray-200 px-4 py-2 text-right">3,030</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Consumo de Agua</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Indicadores Evaluados</h4>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>Volumen total de agua consumida (m³/año)</li>
              <li>Fuentes de abastecimiento (red pública, pozos, superficial)</li>
              <li>Consumo específico por unidad de producción</li>
              <li>Sistemas de recirculación y reutilización</li>
              <li>Gestión de aguas residuales</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-mono text-sm text-gray-800 mb-2">
              Consumo Específico = Volumen Total (m³) / Unidades Producidas
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Este indicador permite comparar eficiencia entre períodos y con referentes sectoriales.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Gestión de Residuos</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Categorías de Residuos</h4>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li><strong>Peligrosos:</strong> Requieren manejo especial según DS 148/2003</li>
              <li><strong>No Peligrosos:</strong> Residuos industriales, comerciales y asimilables a domiciliarios</li>
              <li><strong>Valorizables:</strong> Susceptibles de reciclaje, compostaje o valorización energética</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Productos REP (Ley 20.920)</h4>
            <p className="text-gray-600 mb-2">
              Responsabilidad Extendida del Productor aplica a:
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>Envases y embalajes</li>
              <li>Aparatos eléctricos y electrónicos</li>
              <li>Baterías</li>
              <li>Neumáticos</li>
              <li>Aceites lubricantes</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-mono text-sm text-gray-800 mb-2">
              Tasa de Valorización = (Residuos Valorizados / Residuos Totales) × 100%
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Meta país: 30% de valorización al 2030 (Estrategia Nacional de Residuos Orgánicos)
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-800 mb-3">Referencias Normativas</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• ISO 14064-1:2018 - Cuantificación e informe de emisiones y remociones de GEI</li>
          <li>• GHG Protocol Corporate Standard - Protocolo de contabilidad de GEI</li>
          <li>• Ley 20.920 - Marco para la Gestión de Residuos, REP y Fomento al Reciclaje</li>
          <li>• DS 148/2003 - Reglamento Sanitario sobre Manejo de Residuos Peligrosos</li>
          <li>• Ministerio del Medio Ambiente - Factores de Emisión Chile 2023</li>
        </ul>
      </section>
    </div>
  );
}

// Componente: Glosario
function Glosario() {
  const terminos = [
    {
      termino: "Alcance 1",
      definicion: "Emisiones directas de GEI provenientes de fuentes controladas por la organización, como combustión en instalaciones propias y vehículos de la empresa."
    },
    {
      termino: "Alcance 2",
      definicion: "Emisiones indirectas de GEI derivadas de la electricidad, calor o vapor comprado y consumido por la organización."
    },
    {
      termino: "Dato de Actividad",
      definicion: "Cantidad de combustible, electricidad u otro recurso consumido, que se multiplica por el factor de emisión para calcular las emisiones de GEI."
    },
    {
      termino: "Factor de Emisión",
      definicion: "Coeficiente que cuantifica las emisiones o remociones de GEI por unidad de actividad. Expresado en kgCO₂eq por unidad (litro, kWh, kg, etc.)."
    },
    {
      termino: "GEI (Gases de Efecto Invernadero)",
      definicion: "Gases en la atmósfera que absorben y emiten radiación infrarroja, causando el efecto invernadero. Principales: CO₂, CH₄, N₂O, HFCs, PFCs, SF₆."
    },
    {
      termino: "GHG Protocol",
      definicion: "Protocolo de Gases de Efecto Invernadero, estándar internacional más usado para contabilizar y reportar emisiones de GEI corporativas."
    },
    {
      termino: "Huella de Carbono",
      definicion: "Cantidad total de emisiones de GEI causadas directa e indirectamente por una organización, producto, evento o persona, expresada en toneladas de CO₂ equivalente (tCO₂eq)."
    },
    {
      termino: "Ley REP",
      definicion: "Ley 20.920 de Responsabilidad Extendida del Productor, que establece obligaciones para productores de productos prioritarios (envases, electrónicos, baterías, neumáticos, aceites)."
    },
    {
      termino: "Productos REP",
      definicion: "Productos sujetos a la Ley REP: envases y embalajes, aparatos eléctricos y electrónicos, baterías, neumáticos y aceites lubricantes."
    },
    {
      termino: "Residuo Peligroso",
      definicion: "Residuo que presenta riesgo para la salud pública o el medio ambiente por sus características tóxicas, corrosivas, reactivas o inflamables (según DS 148/2003)."
    },
    {
      termino: "Residuo Valorizable",
      definicion: "Residuo susceptible de ser valorizado mediante reciclaje, compostaje, valorización energética u otra forma de recuperación de materiales o energía."
    },
    {
      termino: "tCO₂eq (toneladas de CO₂ equivalente)",
      definicion: "Unidad de medida que expresa el impacto de diferentes GEI en términos equivalentes de CO₂, usando sus potenciales de calentamiento global (PCG)."
    },
    {
      termino: "Tasa de Valorización",
      definicion: "Porcentaje de residuos que son valorizados (reciclados, compostados, etc.) respecto al total de residuos generados."
    },
    {
      termino: "Consumo Específico",
      definicion: "Indicador de eficiencia que relaciona el consumo de un recurso (agua, energía) con la unidad de producción o servicio."
    }
  ];

  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Glosario de Términos</h2>
      <p className="text-gray-600 mb-6">
        Definiciones de términos técnicos y ambientales utilizados en AmbientApp V2
      </p>

      <div className="space-y-4">
        {terminos.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">{item.termino}</h4>
            <p className="text-gray-600 text-sm">{item.definicion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Documentation;