// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { loginUser, logoutUser, getCurrentUser } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // logout sin redirección inmediata (el interceptor hará la navegación tras mostrar el toast)
  const logout = useCallback(async () => {
    try {
      try {
        await logoutUser();
      } catch (err) {
        console.warn('logoutUser API fallo (no crítico):', err?.message || err);
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (api && api.defaults && api.defaults.headers) {
        delete api.defaults.headers.common['Authorization'];
      }
      setUser(null);
      // <-- NO redirigir aquí; el interceptor controlará la navegación después de mostrar toast
    }
  }, []);

  useEffect(() => {
    if (!api || !api.interceptors) return;

    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        const status = error?.response?.status;
        if (status === 401) {
          const code = error.response.data?.code;
          console.log('Interceptor 401 detectado, code:', code); // ahora code ya existe

          if (code === 'SESSION_INVALIDATED') {
            toast.error('Tu sesión fue cerrada porque iniciaste sesión desde otro dispositivo.');
          } else if (code === 'CUENTA_EXPIRADA') {
            toast.error('Tu cuenta ha expirado.');
          } else {
            toast.error('Tu sesión ha expirado. Vuelve a iniciar sesión.');
          }

          // Esperar un momento para que el toast se renderice antes de limpiar estado / navegar
          setTimeout(() => {
            // limpiar sesión en frontend
            logout();
            // redirigir a login
            window.location.href = '/login';
          }, 2000); // 2s, ajustar si quieres más/menos

        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          if (api && api.defaults && api.defaults.headers) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          const response = await getCurrentUser();
          if (response.success && response.data?.user) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });

      if (response.success) {
        const token = response.data?.token;
        if (token) {
          localStorage.setItem('token', token);
          if (api && api.defaults && api.defaults.headers) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        }
        setUser(response.data.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || 'Error al iniciar sesión',
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.message || 'Error de conexión',
      };
    }
  };

  const logoutPublic = logout;

  const value = {
    user,
    setUser,
    loading,
    login,
    logout: logoutPublic,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}