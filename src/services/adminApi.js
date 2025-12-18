// src/services/adminApi.js
import api from './api';

/**
 * Obtener lista de usuarios con filtros y paginación
 * filters: {
 *   page?: number,
 *   limit?: number,
 *   search?: string,
 *   plan?: 'free' | 'pro',
 *   estado?: 'activa' | 'suspendida' | 'cancelada',
 *   sortBy?: string,
 *   sortOrder?: 'asc' | 'desc'
 * }
 */
export const getUsers = async (filters = {}) => {
  const params = {};

  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.search) params.search = filters.search;
  if (filters.plan) params.plan = filters.plan;
  if (filters.estado) params.estado = filters.estado;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  const response = await api.get('/admin/users', { params });
  return response.data; // idealmente { users, total, page, totalPages, ... }
};

export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data; // usuario + diagnósticos (según tu adminController)
};

export const updateUser = async (id, data) => {
  // data puede incluir: { tipoSuscripcion, estadoSuscripcion, role, ... }
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data; // usuario actualizado
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data; // { message } o similar
};

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data; // { totalUsuarios, totalDiagnosticos, ... }
};