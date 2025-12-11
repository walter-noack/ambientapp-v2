import axios from 'axios';

// Configuración base de axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
/*
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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
*/
// ================================
// AUTH
// ================================
export const loginUser = async (credentials) => {
  // 🔓 BYPASS TEMPORAL
  return {
    token: 'fake-token-' + Date.now(),
    user: {
      email: credentials.email,
      name: 'Usuario Demo',
      id: 'demo-123'
    }
  };
};

export const logoutUser = async () => {
  // 🔓 BYPASS TEMPORAL
  return { success: true };
};

export const getCurrentUser = async () => {
  // 🔓 BYPASS TEMPORAL
  return {
    email: 'demo@test.com',
    name: 'Usuario Demo',
    id: 'demo-123'
  };
};

// ================================
// EVALUACIONES
// ================================
export const getEvaluaciones = async () => {
  // 🔓 BYPASS TEMPORAL - DATOS FAKE PARA DESARROLLO
  return [
    {
      _id: '1',
      companyName: 'Empresa Demo 1',
      period: '2024-Q4',
      finalScore: 85,
      scores: { carbonScore: 80, waterScore: 85, wasteScore: 90 },
      createdAt: new Date('2024-12-01'),
    },
    {
      _id: '2',
      companyName: 'Empresa Demo 2',
      period: '2024-Q3',
      finalScore: 65,
      scores: { carbonScore: 60, waterScore: 70, wasteScore: 65 },
      createdAt: new Date('2024-09-15'),
    },
    {
      _id: '3',
      companyName: 'Empresa Demo 3',
      period: '2024-Q2',
      finalScore: 45,
      scores: { carbonScore: 40, waterScore: 50, wasteScore: 45 },
      createdAt: new Date('2024-06-20'),
    },
  ];
};

export const getEvaluacionById = async (id) => {
  // 🔓 BYPASS TEMPORAL - DATOS FAKE SIN LLAMAR AL BACKEND
  const fakeData = [
    {
      _id: '1',
      companyName: 'Empresa Demo 1',
      period: '2024-Q4',
      finalScore: 85,
      scores: { carbonScore: 80, waterScore: 85, wasteScore: 90 },
      createdAt: new Date('2024-12-01'),
      alcance1: 18.5,
      alcance2: 12.3,
      residuosGenerados: 3200,
      residuosValorizados: 2400,
      productosREP: [
        {
          producto: 'Envases y Embalajes',
          anio: 2024,
          cantidadGenerada: 1200,
          cantidadValorizada: 950,
        },
        {
          producto: 'Aparatos Eléctricos y Electrónicos (RAEE)',
          anio: 2024,
          cantidadGenerada: 450,
          cantidadValorizada: 380,
        },
        {
          producto: 'Neumáticos',
          anio: 2024,
          cantidadGenerada: 800,
          cantidadValorizada: 720,
        },
      ],
    },
    {
      _id: '2',
      companyName: 'Empresa Demo 2',
      period: '2024-Q3',
      finalScore: 65,
      scores: { carbonScore: 60, waterScore: 70, wasteScore: 65 },
      createdAt: new Date('2024-09-15'),
      alcance1: 22.8,
      alcance2: 15.6,
      residuosGenerados: 2800,
      residuosValorizados: 1400,
      productosREP: [
        {
          producto: 'Aceites Lubricantes',
          anio: 2024,
          cantidadGenerada: 350,
          cantidadValorizada: 180,
        },
        {
          producto: 'Baterías',
          anio: 2024,
          cantidadGenerada: 120,
          cantidadValorizada: 85,
        },
      ],
    },
    {
      _id: '3',
      companyName: 'Empresa Demo 3',
      period: '2024-Q2',
      finalScore: 45,
      scores: { carbonScore: 40, waterScore: 50, wasteScore: 45 },
      createdAt: new Date('2024-06-20'),
      alcance1: 28.5,
      alcance2: 10.2,
      residuosGenerados: 4500,
      residuosValorizados: 1350,
      productosREP: [], // Sin productos REP
    },
  ];
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return fakeData.find(e => e._id === id) || fakeData[0];
};

export const createEvaluacion = async (data) => {
  const response = await api.post('/evaluaciones', data);
  return response.data;
};

export const updateEvaluacion = async (id, data) => {
  const response = await api.put(`/evaluaciones/${id}`, data);
  return response.data;
};

export const deleteEvaluacion = async (id) => {
  const response = await api.delete(`/evaluaciones/${id}`);
  return response.data;
};

// ================================
// RESIDUOS REP
// ================================
export const getResiduosRep = async (empresaId) => {
  const response = await api.get(`/residuos-rep/${empresaId}`);
  return response.data;
};

export const createResiduoRep = async (data) => {
  const response = await api.post('/residuos-rep', data);
  return response.data;
};

export const updateResiduoRep = async (id, data) => {
  const response = await api.put(`/residuos-rep/${id}`, data);
  return response.data;
};

export const deleteResiduoRep = async (id) => {
  const response = await api.delete(`/residuos-rep/${id}`);
  return response.data;
};

export default api;