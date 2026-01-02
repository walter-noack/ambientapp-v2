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

export const registrarUsuario = async (payload) => {
  const res = await api.post('/auth/registro', payload);
  return res.data; // debería ser { success, data: { user, token }, ... }
};

export const resendVerification = (payload) => {
  // payload puede ser { email } o { userId } según lo implementado en backend
  return api.post('/auth/resend-verification', payload);
};

// Cambiar contraseña del usuario
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/change-password', {
    currentPassword,
    newPassword
  });
  return response.data;
};