import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ListaEvaluaciones from './pages/ListaEvaluaciones';
import DetalleEvaluacion from './pages/DetalleEvaluacion';
import NuevaEvaluacion from './pages/NuevaEvaluacion';
import EditarEvaluacion from './pages/EditarEvaluacion';
import PreviewPDF from './pages/PreviewPDF';
import AcercaDe from './pages/AcercaDe';

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
      {/* Ruta pública */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Rutas protegidas con layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Evaluaciones */}
        <Route path="evaluaciones" element={<ListaEvaluaciones />} />
        <Route path="evaluaciones/nueva" element={<NuevaEvaluacion />} />
        <Route path="evaluaciones/:id/editar" element={<EditarEvaluacion />} />

        {/* Detalle */}
        <Route path="detalle/:id" element={<DetalleEvaluacion />} />

        {/* PDF Preview */}
        <Route path="pdf/:id" element={<PreviewPDF />} />

        {/* Acerca de */}
        <Route path="acerca-de" element={<AcercaDe />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}