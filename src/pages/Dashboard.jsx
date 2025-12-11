import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvaluaciones } from "../services/api";
import { KPICard } from "../components/dashboard/KPICard";
import { DimensionCard } from "../components/dashboard/DimensionCard";
import { Loading } from "../components/shared/ui/Loading";
import { Badge } from "../components/shared/ui/Badge";

export default function Dashboard() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    total: 0,
    nivelPromedio: 0,
    ultimaFecha: null,
    promCarbono: 0,
    promAgua: 0,
    promResiduos: 0,
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getEvaluaciones();

        // Ordenar por fecha descendente
        const ordenadas = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Tomar solo las últimas 10
        const ultimas10 = ordenadas.slice(0, 10);
        setEvaluaciones(ultimas10);

        const total = data.length;
        const nivelPromedio =
          total > 0
            ? data.reduce((acc, e) => acc + (e.finalScore || 0), 0) / total
            : 0;

        // Última fecha
        const fechas = data
          .map((ev) => new Date(ev.createdAt))
          .sort((a, b) => b - a);
        const ultimaFecha = fechas[0]?.toLocaleDateString("es-CL") || "-";

        // Promedios por dimensión
        const promCarbono =
          total > 0
            ? data.reduce((acc, e) => acc + (e.scores?.carbonScore || 0), 0) / total
            : 0;

        const promAgua =
          total > 0
            ? data.reduce((acc, e) => acc + (e.scores?.waterScore || 0), 0) / total
            : 0;

        const promResiduos =
          total > 0
            ? data.reduce((acc, e) => acc + (e.scores?.wasteScore || 0), 0) / total
            : 0;

        setKpis({
          total,
          nivelPromedio,
          ultimaFecha,
          promCarbono,
          promAgua,
          promResiduos,
        });
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <Loading size="lg" text="Cargando dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER CON GRADIENTE */}
      <div className="bg-gradient-to-r from-primary-600 to-emerald-600 text-white">
        <div className="container-app py-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-3">Dashboard Ambiental</h1>
              <p className="text-primary-100 text-lg">
                Panel de control de diagnósticos ambientales
              </p>
            </div>

            <Link
              to="/evaluaciones/nueva"
              className="px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg"
            >
              + Nuevo Diagnóstico
            </Link>
          </div>
        </div>
      </div>

      <div className="container-app py-8 space-y-8">
        
        {/* KPIs PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <KPICard
            title="Total Diagnósticos"
            value={kpis.total}
            subtitle={`Última actualización: ${kpis.ultimaFecha}`}
            color="#10b981"
            icon="📊"
          />

          <KPICard
            title="Nivel Promedio"
            value={kpis.nivelPromedio.toFixed(1)}
            subtitle="/ 100"
            color="#2563EB"
            icon="📈"
          />

          <KPICard
            title="Última Evaluación"
            value={kpis.ultimaFecha}
            subtitle="Fecha más reciente"
            color="#8B5CF6"
            icon="📅"
          />

        </div>

        {/* DIMENSIONES */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Desempeño por Dimensión
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <DimensionCard
              titulo="Carbono"
              valor={kpis.promCarbono}
              color="#DC2626"
              icon="🌍"
              descripcion="Gestión de emisiones GEI"
            />

            <DimensionCard
              titulo="Agua"
              valor={kpis.promAgua}
              color="#2563EB"
              icon="💧"
              descripcion="Eficiencia hídrica"
            />

            <DimensionCard
              titulo="Residuos"
              valor={kpis.promResiduos}
              color="#059669"
              icon="♻️"
              descripcion="Valorización y gestión"
            />

          </div>
        </div>

        {/* TABLA DE ÚLTIMOS DIAGNÓSTICOS */}
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Últimos 10 Diagnósticos
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Historial reciente de evaluaciones ambientales
            </p>
          </div>

          {evaluaciones.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No hay evaluaciones registradas aún
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 text-slate-600 text-sm">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Empresa</th>
                    <th className="text-left py-4 px-6 font-semibold">Período</th>
                    <th className="text-center py-4 px-6 font-semibold">Puntaje</th>
                    <th className="text-center py-4 px-6 font-semibold">Nivel</th>
                    <th className="text-center py-4 px-6 font-semibold">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {evaluaciones.map((ev) => {
                    // Determinar nivel y color
                    let nivel = "bajo";
                    if (ev.finalScore >= 75) nivel = "avanzado";
                    else if (ev.finalScore >= 50) nivel = "intermedio";
                    else if (ev.finalScore >= 25) nivel = "basico";

                    return (
                      <tr key={ev._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-900">{ev.companyName}</p>
                        </td>
                        <td className="py-4 px-6 text-slate-600">{ev.period}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-lg font-bold text-primary-600">
                            {ev.finalScore}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Badge variant={nivel}>
                            {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Link
                            to={`/detalle/${ev._id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-semibold text-sm"
                          >
                            Ver detalle →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}