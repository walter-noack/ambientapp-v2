import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, Leaf } from 'lucide-react';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navLinkClass = (path) => {
    return `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive(path)
      ? 'bg-primary-500 text-white'
      : 'text-slate-700 hover:bg-slate-100'
      }`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container-app">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <img
                src="/src/assets/logo.svg"
                alt="AmbientApp"
                className="h-12 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 leading-none">
                  AmbientApp
                </span>
                <span className="text-xs text-slate-500">
                  Diagnóstico Ambiental
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/evaluaciones" className={navLinkClass('/evaluaciones')}>
                <FileText className="w-4 h-4" />
                <span>Evaluaciones</span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-semibold text-sm">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="font-medium text-slate-700">{user?.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="container-app py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/logo.svg"
                alt="AmbientApp"
                className="h-10 w-auto"
              />
              <div className="text-sm text-slate-600">
                © {new Date().getFullYear()} AmbientApp. Elaborado por @mellamowalter.cl
              </div>
            </div>
            <div className="flex gap-6 text-sm text-slate-600">
              <a href="#" className="hover:text-primary-600 transition-colors">
                Soporte
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                Documentación
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}