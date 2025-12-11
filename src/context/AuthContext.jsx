import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, getCurrentUser } from '../services/api';

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

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
  // 🔓 BYPASS TEMPORAL - SOLO PARA DESARROLLO
  try {
    // Simular login exitoso
    const fakeUser = {
      email: email,
      name: 'Usuario Demo',
      id: 'demo-123'
    };
    
    const fakeToken = 'fake-token-' + Date.now();
    
    localStorage.setItem('token', fakeToken);
    setUser(fakeUser);
    
    return { success: true };
  } catch (error) {
    console.error('Error en login:', error);
    return { 
      success: false, 
      error: 'Error al iniciar sesión' 
    };
  }
};

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}