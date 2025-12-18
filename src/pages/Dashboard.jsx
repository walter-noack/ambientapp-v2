import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loading } from "../components/shared/ui/Loading";
import { Badge } from "../components/shared/ui/Badge";
import { Card } from "../components/shared/ui/Card";
import { BarChart3, TrendingUp, Calendar, Plus, Eye, Flame, Droplets, Recycle } from "lucide-react";
import { Edit2, Copy, Trash2 } from 'lucide-react';
import { getEvaluaciones, eliminarEvaluacion } from "../services/api";


export default function Dashboard() {
  const navigate = useNavigate();
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
      const response = await getEvaluaciones();
      
      // El backend devuelve { success: true, data: { diagnosticos: [...] } }
      const data = response.data?.diagnosticos || [];
      
      const ordenadas = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const ultimas5 = ordenadas.slice(0, 5);
      setEvaluaciones(ultimas5);

      const total = data.length;
      
      // Adaptar campos del backend: puntuacionGeneral en lugar de finalScore
      const nivelPromedio =
        total > 0
          ? data.reduce((acc, e) => acc + (e.puntuacionGeneral || 0), 0) / total
          : 0;

      const fechas = data
        .map((ev) => new Date(ev.createdAt))
        .sort((a, b) => b - a);
      const ultimaFecha = fechas[0]?.toLocaleDateString("es-CL") || "-";

      // Adaptar campos del backend
      const promCarbono =
        total > 0
          ? data.reduce((acc, e) => acc + (e.carbono?.puntuacion || 0), 0) / total
          : 0;

      const promAgua =
        total > 0
          ? data.reduce((acc, e) => acc + (e.agua?.puntuacion || 0), 0) / total
          : 0;

      const promResiduos =
        total > 0
          ? data.reduce((acc, e) => acc + (e.residuos?.puntuacion || 0), 0) / total
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
      setEvaluaciones([]);
    } finally {
      setLoading(false);
    }
  }

  load();
}, []);

const handleEliminar = async (id) => {
  if (window.confirm('¿Estás seguro de eliminar esta evaluación? Esta acción no se puede deshacer.')) {
    try {
      await eliminarEvaluacion(id);
      
      // Actualizar lista eliminando el item
      setEvaluaciones(prev => prev.filter(ev => ev._id !== id));
      
      // Recalcular KPIs
      const nuevasEvaluaciones = evaluaciones.filter(ev => ev._id !== id);
      const total = nuevasEvaluaciones.length;
      
      if (total > 0) {
        const nivelPromedio = nuevasEvaluaciones.reduce((acc, e) => acc + (e.finalScore || 0), 0) / total;
        const promCarbono = nuevasEvaluaciones.reduce((acc, e) => acc + (e.scores?.carbonScore || 0), 0) / total;
        const promAgua = nuevasEvaluaciones.reduce((acc, e) => acc + (e.scores?.waterScore || 0), 0) / total;
        const promResiduos = nuevasEvaluaciones.reduce((acc, e) => acc + (e.scores?.wasteScore || 0), 0) / total;
        
        setKpis(prev => ({
          ...prev,
          total,
          nivelPromedio,
          promCarbono,
          promAgua,
          promResiduos
        }));
      } else {
        setKpis({
          total: 0,
          nivelPromedio: 0,
          ultimaFecha: null,
          promCarbono: 0,
          promAgua: 0,
          promResiduos: 0,
        });
      }
      
      alert('Evaluación eliminada correctamente');
    } catch (error) {
      alert('Error al eliminar la evaluación. Intenta nuevamente.');
    }
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <Loading size="lg" text="Cargando dashboard..." />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
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
              className="flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Diagnóstico</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-app py-8 space-y-8">

        {/* KPIs PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="p-6 border-l-4 border-l-primary-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Total Diagnósticos
                </p>
                <p className="text-4xl font-bold text-slate-900 mb-1">
                  {kpis.total}
                </p>
                <p className="text-xs text-slate-500">
                  Última actualización: {kpis.ultimaFecha}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-secondary-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Nivel Promedio
                </p>
                <p className="text-4xl font-bold text-slate-900 mb-1">
                  {kpis.nivelPromedio.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">
                  / 100 puntos
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-accent-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Última Evaluación
                </p>
                <p className="text-2xl font-bold text-slate-900 mb-1">
                  {kpis.ultimaFecha}
                </p>
                <p className="text-xs text-slate-500">
                  Fecha más reciente
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </Card>

        </div>

        {/* DIMENSIONES */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Desempeño por Dimensión
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <Card hover className="p-6 border-l-4 border-l-red-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                    Carbono
                  </p>
                  <p className="text-4xl font-bold text-slate-900">
                    {kpis.promCarbono.toFixed(1)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-3">Gestión de emisiones GEI</p>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${kpis.promCarbono}%` }}
                />
              </div>
            </Card>

            <Card hover className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                    Agua
                  </p>
                  <p className="text-4xl font-bold text-slate-900">
                    {kpis.promAgua.toFixed(1)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-3">Eficiencia hídrica</p>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${kpis.promAgua}%` }}
                />
              </div>
            </Card>

            <Card hover className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                    Residuos
                  </p>
                  <p className="text-4xl font-bold text-slate-900">
                    {kpis.promResiduos.toFixed(1)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-3">Valorización y gestión</p>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${kpis.promResiduos}%` }}
                />
              </div>
            </Card>

          </div>
        </div>

        {/* TABLA DE ÚLTIMOS DIAGNÓSTICOS */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Últimos 5 Diagnósticos
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Historial reciente de diagnósticos ambientales
            </p>
          </div>

          {evaluaciones.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No hay evaluaciones registradas aún
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-600 text-sm border-y border-slate-200">
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

                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/detalle/${ev._id}`}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-semibold text-sm"
                              title="Ver detalle"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <Link
                              to={`/evaluaciones/editar/${ev._id}`}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-sm"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDuplicar(ev._id)}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-semibold text-sm"
                              title="Duplicar"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleEliminar(ev._id)}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold text-sm"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>



                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}