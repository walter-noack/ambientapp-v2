// src/services/authApi.js
import api from './api'; // tu instancia axios con baseURL + token

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data; // usuario
};

export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data; // usuario actualizado
};