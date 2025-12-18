import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEvaluaciones, eliminarEvaluacion } from "../services/api";
import { Loading } from "../components/shared/ui/Loading";
import { Badge } from "../components/shared/ui/Badge";
import { Card } from "../components/shared/ui/Card";
import { Eye, Edit2, Copy, Trash2, Search, Filter, Plus } from "lucide-react";

export default function ListaEvaluaciones() {
  const navigate = useNavigate();
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [evaluacionesFiltradas, setEvaluacionesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("todos");
  const [ordenamiento, setOrdenamiento] = useState("recientes");

  useEffect(() => {
    async function load() {
      try {
        const response = await getEvaluaciones();

        // El backend devuelve { success: true, data: { diagnosticos: [...] } }
        const data = response.data?.diagnosticos || [];

        setEvaluaciones(data);
        setEvaluacionesFiltradas(data);
      } catch (error) {
        console.error("Error cargando evaluaciones:", error);
        setEvaluaciones([]);
        setEvaluacionesFiltradas([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let resultado = [...evaluaciones];

    // Búsqueda por nombre de empresa
    if (busqueda.trim()) {
      resultado = resultado.filter(ev =>
        ev.companyName.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtro por nivel (usar puntuacionGeneral del backend)
    if (filtroNivel !== "todos") {
      resultado = resultado.filter(ev => {
        const score = ev.puntuacionGeneral || 0;
        if (filtroNivel === "avanzado") return score >= 75;
        if (filtroNivel === "intermedio") return score >= 50 && score < 75;
        if (filtroNivel === "basico") return score >= 25 && score < 50;
        if (filtroNivel === "bajo") return score < 25;
        return true;
      });
    }

    // Ordenamiento (usar puntuacionGeneral del backend)
    if (ordenamiento === "recientes") {
      resultado.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (ordenamiento === "antiguos") {
      resultado.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (ordenamiento === "puntaje-alto") {
      resultado.sort((a, b) => (b.puntuacionGeneral || 0) - (a.puntuacionGeneral || 0));
    } else if (ordenamiento === "puntaje-bajo") {
      resultado.sort((a, b) => (a.puntuacionGeneral || 0) - (b.puntuacionGeneral || 0));
    } else if (ordenamiento === "empresa") {
      resultado.sort((a, b) => a.companyName.localeCompare(b.companyName));
    }

    setEvaluacionesFiltradas(resultado);
  }, [busqueda, filtroNivel, ordenamiento, evaluaciones]);

  const handleDuplicar = (id) => {
    if (window.confirm('¿Deseas duplicar esta evaluación?')) {
      navigate(`/evaluaciones/duplicar/${id}`);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta evaluación? Esta acción no se puede deshacer.')) {
      try {
        await eliminarEvaluacion(id);
        setEvaluaciones(prev => prev.filter(ev => ev._id !== id));
        alert('Evaluación eliminada correctamente');
      } catch (error) {
        alert('Error al eliminar la evaluación. Intenta nuevamente.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <Loading size="lg" text="Cargando evaluaciones..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-app">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Diagnósticos Ambientales
            </h1>
            <p className="text-slate-600">
              Listado completo de todas las evaluaciones realizadas ({evaluaciones.length})
            </p>
          </div>

          <Link
            to="/evaluaciones/nueva"
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Diagnóstico</span>
          </Link>
        </div>

        {/* Filtros y búsqueda */}
        <Card className="p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">

            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por empresa..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Filtro por nivel */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={filtroNivel}
                onChange={(e) => setFiltroNivel(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
              >
                <option value="todos">Todos los niveles</option>
                <option value="avanzado">Avanzado (≥75)</option>
                <option value="intermedio">Intermedio (50-74)</option>
                <option value="basico">Básico (25-49)</option>
                <option value="bajo">Bajo (&lt;25)</option>
              </select>
            </div>

            {/* Ordenamiento */}
            <select
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
              <option value="puntaje-alto">Mayor puntaje</option>
              <option value="puntaje-bajo">Menor puntaje</option>
              <option value="empresa">Nombre (A-Z)</option>
            </select>

          </div>

          {/* Resumen de filtros */}
          {(busqueda || filtroNivel !== "todos") && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <span>Mostrando {evaluacionesFiltradas.length} de {evaluaciones.length} evaluaciones</span>
              <button
                onClick={() => {
                  setBusqueda("");
                  setFiltroNivel("todos");
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </Card>

        {/* Tabla de evaluaciones */}
        <Card className="p-6">
          {evaluacionesFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">
                {busqueda || filtroNivel !== "todos"
                  ? "No se encontraron evaluaciones con los filtros aplicados"
                  : "No hay evaluaciones registradas aún"}
              </p>
              {!busqueda && filtroNivel === "todos" && (
                <Link
                  to="/evaluaciones/nueva"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Crear Primera Evaluación</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-600 text-sm border-y border-slate-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Empresa</th>
                    <th className="text-left py-4 px-6 font-semibold">Período</th>
                    <th className="text-left py-4 px-6 font-semibold">Fecha</th>
                    <th className="text-center py-4 px-6 font-semibold">Puntaje</th>
                    <th className="text-center py-4 px-6 font-semibold">Nivel</th>
                    <th className="text-center py-4 px-6 font-semibold">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {evaluacionesFiltradas.map((ev) => {
                    const score = ev.puntuacionGeneral || 0;
                    let nivel = "bajo";
                    if (score >= 75) nivel = "avanzado";
                    else if (score >= 50) nivel = "intermedio";
                    else if (score >= 25) nivel = "basico";

                    // Construir period del backend (semestre + año)
                    const period = `${ev.semestre}-${ev.anio}`;


                    return (
                      <tr key={ev._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-900">{ev.companyName}</p>
                        </td>
                        <td className="py-4 px-6 text-slate-600">{ev.period}</td>
                        <td className="py-4 px-6 text-slate-600 text-sm">
                          {new Date(ev.createdAt).toLocaleDateString("es-CL")}
                        </td>
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