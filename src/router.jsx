import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import ListaEvaluaciones from './pages/ListaEvaluaciones';
import DetalleEvaluacion from './pages/DetalleEvaluacion';
import NuevaEvaluacion from './pages/NuevaEvaluacion';
import EditarEvaluacion from './pages/EditarEvaluacion';
import PreviewPDF from './pages/PreviewPDF';
import AcercaDe from './pages/AcercaDe';
import Landing from './pages/Landing';
import Documentation from './pages/Documentation';
import Soporte from './pages/Soporte';

import UsuariosAdmin from './pages/Admin/UsuariosAdmin';
import Perfil from './pages/Perfil';
import Upgrade from './pages/Upgrade';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Admin Route Component (solo para admins)
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Public Route Component (redirect if logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="spinner" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/registro"
        element={
          <PublicRoute>
            <Registro />
          </PublicRoute>
        }
      />

      {/* Rutas protegidas con layout */}
      <Route path="/*" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* Dashboard sin index ni path="/" */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Evaluaciones */}
        <Route path="evaluaciones" element={<ListaEvaluaciones />} />
        <Route path="evaluaciones/nueva" element={<NuevaEvaluacion />} />
        <Route path="evaluaciones/editar/:id" element={<NuevaEvaluacion modoEdicion={true} />} />
        <Route path="evaluaciones/duplicar/:id" element={<NuevaEvaluacion modoDuplicar={true} />} />

        {/* Detalle */}
        <Route path="detalle/:id" element={<DetalleEvaluacion />} />

        {/* PDF Preview */}
        <Route path="pdf/:id" element={<PreviewPDF />} />

        {/* Acerca de */}
        <Route path="acerca-de" element={<AcercaDe />} />

        {/* Documentación */}
        <Route path="documentacion" element={<Documentation />} />

        {/* Soporte */}
        <Route path="soporte" element={<Soporte />} />

        {/* Perfil */}
        <Route path="perfil" element={<Perfil />} />

        {/* Upgrade */}
        <Route path="upgrade" element={<Upgrade />} />

        {/* Administración (solo admins) */}
        <Route
          path="admin/usuarios"
          element={
            <AdminRoute>
              <UsuariosAdmin />
            </AdminRoute>
          }
        />

        {/* Ruta catch-all protegida: redirige a dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Ruta catch-all pública: redirige a landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}