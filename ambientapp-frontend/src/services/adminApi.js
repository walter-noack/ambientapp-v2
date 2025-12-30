import api from './api';

/**
 * Normaliza la respuesta del backend y devuelve:
 * { users: [], total, page, totalPages }
 */
const normalizeListResponse = (response) => {
  // response puede ser: axiosResponse (con response.data),
  // o ya el payload. Soporte ambas formas:
  const payload = response?.data?.data ?? response?.data ?? response ?? {};

  // Usuarios (backend usa "usuarios", frontend espera "users")
  const usuarios = payload.usuarios || payload.users || [];

  // Paginación (backend devuelve payload.pagination)
  const pagination = payload.pagination || {
    page: payload.page || 1,
    limit: payload.limit || usuarios.length || 10,
    total: payload.total ?? usuarios.length,
    pages: payload.pages || payload.totalPages || 1,
  };

  // Alinear nombres y asegurar que cada usuario tenga `limites.diagnosticosRealizados`
  const mappedUsers = usuarios.map((u) => {
    const limitesPrev = u.limites || {};
    return {
      ...u,
      limites: {
        ...limitesPrev,
        // si el backend agregó diagnosticosRealizados en la raíz, lo ponemos dentro de limites para compatibilidad
        diagnosticosRealizados:
          u.diagnosticosRealizados ?? limitesPrev.diagnosticosRealizados ?? 0,
        // preservar diagnosticosMes si existe
        diagnosticosMes: limitesPrev.diagnosticosMes ?? limitesPrev.diagnosticosMes,
      },
    };
  });

  return {
    users: mappedUsers,
    total: pagination.total ?? mappedUsers.length,
    page: pagination.page ?? 1,
    totalPages: pagination.pages ?? pagination.totalPages ?? 1,
  };
};

export const getUsers = async (filters = {}) => {
  const params = {};

  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.search) params.search = filters.search;
  if (filters.plan) params.plan = filters.plan;
  if (filters.estado) params.estado = filters.estado;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;
  if (filters.verified) params.verified = filters.verified; // Añadido para filtro verificación

  const response = await api.get('/admin/users', { params });
  return normalizeListResponse(response);
};

export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  // payload: response.data.data (según controller -> { usuario, diagnosticos, diagnosticosCount })
  const payload = response?.data?.data ?? response?.data ?? response;
  return payload;
};

export const createUser = async (data) => {
  const response = await api.post('/admin/users', data);
  // devuelve payload.data (según tu backend: { usuario: {...} })
  const payload = response?.data?.data ?? response?.data ?? response;
  return payload;
};

export const updateUser = async (id, data) => {
  // data puede incluir: { tipoSuscripcion, estadoSuscripcion, role, limites, features, notas, isVerified }
  const response = await api.put(`/admin/users/${id}`, data);
  // backend devuelve { success: true, data: { usuario: ... } }
  const payload = response?.data?.data ?? response?.data ?? response;
  return payload;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  // delete suele devolver { success: true, message: '...' } sin data
  return response?.data ?? response;
};

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  // backend devuelve { success: true, data: { usuarios: {...}, diagnosticos: {...} } }
  const payload = response?.data?.data ?? response?.data ?? response;

  return {
    totalUsuarios: payload?.usuarios?.total ?? null,
    totalFree: payload?.usuarios?.free ?? null,
    totalPro: payload?.usuarios?.pro ?? null,
    totalActivos: payload?.usuarios?.activos ?? null,
    nuevosUltimoMes: payload?.usuarios?.nuevosUltimoMes ?? null,
    totalDiagnosticos: payload?.diagnosticos?.total ?? null,
    diagnosticosUltimoMes: payload?.diagnosticos?.ultimoMes ?? null,
    promedioDiagnosticosPorUsuario: payload?.diagnosticos?.promedioPorUsuario ?? null,
  };
};

export const resendVerificationEmail = async (userId) => {
  const response = await api.post(`/admin/users/${userId}/resend-verification`);
  return response.data;
};