import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import EmailVerificationBanner from "../EmailVerificationBanner";
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, BookOpen, Users, User, Menu } from 'lucide-react';
import logo from '../../assets/logo.svg';
import ChangePasswordForm from '../ChangePasswordForm';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const userMenuRef = useRef();

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handlePerfilClick = () => {
    setUserMenuOpen(false);
    navigate('/perfil');
  };

  const handleChangePasswordClick = () => {
    setUserMenuOpen(false);
    setShowChangePasswordModal(true);
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
      {/* Modal de cambio de contraseña */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ChangePasswordForm onClose={() => setShowChangePasswordModal(false)} />
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container-app">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <img src={logo} alt="AmbientApp" className="h-12 w-auto" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 leading-none">
                  AmbientApp
                </span>
                <span className="text-xs text-slate-500">
                  Diagnóstico Ambiental
                </span>
              </div>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/evaluaciones" className={navLinkClass('/evaluaciones')}>
                <FileText className="w-4 h-4" />
                <span>Diagnósticos</span>
              </Link>
              <Link to="/documentacion" className={navLinkClass('/documentacion')}>
                <BookOpen className="w-4 h-4" />
                <span>Documentación</span>
              </Link>

              {/* Enlace Admin - Solo visible para admins */}
              {user?.role === 'admin' && (
                <Link to="/admin/usuarios" className={navLinkClass('/admin')}>
                  <Users className="w-4 h-4" />
                  <span>Administración</span>
                </Link>
              )}
            </div>

            {/* User Menu + Hamburger */}
            <div className="flex items-center gap-3">
              {/* Menú desplegable de usuario - Desktop */}
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(prev => !prev)}
                  className="flex items-center gap-2 text-sm hover:bg-slate-100 px-2 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-sm">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-slate-700">
                      {user?.email}
                    </span>
                    {user?.role === 'admin' && (
                      <span className="text-xs text-purple-600 font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                      onClick={handlePerfilClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Perfil
                    </button>
                    <button
                      onClick={handleChangePasswordClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cambiar contraseña
                    </button>
                  </div>
                )}
              </div>

              {/* Botón perfil mobile */}
              <Link
                to="/perfil"
                className="md:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Botón logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>

              {/* Botón hamburguesa - Mobile */}
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 bg-white py-3">
              <div className="flex flex-col gap-1">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/evaluaciones"
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${location.pathname === '/evaluaciones'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="w-4 h-4" />
                  <span>Diagnósticos</span>
                </Link>

                <Link
                  to="/documentacion"
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${location.pathname === '/documentacion'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Documentación</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin/usuarios"
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${location.pathname.startsWith('/admin')
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Users className="w-4 h-4" />
                    <span>Administración</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* BANNER DE VERIFICACIÓN */}
        <EmailVerificationBanner />
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="container-app py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="AmbientApp" className="h-12 w-auto" />
              <div className="text-sm text-slate-600">
                © {new Date().getFullYear()} AmbientApp. Elaborado por
                @mellamowalter.cl
              </div>
            </div>
            <div className="flex gap-6 text-sm text-slate-600">
              <a href="/soporte" className="hover:text-primary-600 transition-colors">
                Soporte
              </a>
              <a
                href="/documentacion"
                className="hover:text-primary-600 transition-colors"
              >
                Documentación
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}