const express = require('express');
const router = express.Router();

const {
  registro,
  login,
  obtenerPerfil,
  obtenerUsuarioActual,
  actualizarPerfil,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword, 
  changePassword
} = require('../controllers/authController');

const { protegerRuta } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', registro);
router.post('/login', login);

// Verificación de email (POST y GET para soporte de link directo)
router.post('/verify-email', verifyEmail);
router.get('/verify-email', verifyEmail);

// Reenvío de verificación (publico para "Olvidé verificar" / formulario)
router.post('/resend-verification', resendVerification);

// Recuperación de contraseña
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Rutas protegidas
router.get('/me', protegerRuta, obtenerUsuarioActual);
router.get('/profile', protegerRuta, obtenerPerfil);
router.put('/profile', protegerRuta, actualizarPerfil);

// Ruta para cambiar contraseña (protegida)
router.put('/change-password', protegerRuta, changePassword);

module.exports = router;