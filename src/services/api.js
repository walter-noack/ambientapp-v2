import axios from 'axios';

// Configuración base de axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTENTICACIÓN
// ============================================

export const registro = async (userData) => {
  try {
    const response = await api.post('/auth/registro', userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al registrar usuario' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al iniciar sesión' };
  }
};

export const obtenerPerfil = async () => {
  try {
    const response = await api.get('/auth/me');
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener perfil' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// ============================================
// DIAGNÓSTICOS
// ============================================

export const crearDiagnostico = async (diagnosticoData) => {
  try {
    const response = await api.post('/diagnosticos', diagnosticoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al crear diagnóstico' };
  }
};

export const obtenerDiagnosticos = async (params = {}) => {
  try {
    const response = await api.get('/diagnosticos', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener diagnósticos' };
  }
};

export const obtenerDiagnosticoPorId = async (id) => {
  try {
    const response = await api.get(`/diagnosticos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener diagnóstico' };
  }
};

export const actualizarDiagnostico = async (id, diagnosticoData) => {
  try {
    const response = await api.put(`/diagnosticos/${id}`, diagnosticoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar diagnóstico' };
  }
};

export const eliminarDiagnostico = async (id) => {
  try {
    const response = await api.delete(`/diagnosticos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar diagnóstico' };
  }
};

export const obtenerEstadisticas = async () => {
  try {
    const response = await api.get('/diagnosticos/estadisticas');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener estadísticas' };
  }
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// ============================================
// COMPATIBILIDAD CON NOMBRES ANTERIORES
// ============================================

export const getEvaluaciones = obtenerDiagnosticos;
export const getEvaluacionById = obtenerDiagnosticoPorId;
export const createEvaluacion = crearDiagnostico;
export const updateEvaluacion = actualizarDiagnostico;
export const deleteEvaluacion = eliminarDiagnostico;
export const eliminarEvaluacion = eliminarDiagnostico;

export const loginUser = login;
export const logoutUser = logout;
export const getCurrentUser = obtenerPerfil;

export default api;