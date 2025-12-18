const express = require('express');
const router = express.Router();

const {
  registro,
  login,
  obtenerPerfil,
  obtenerUsuarioActual,
  actualizarPerfil
} = require('../controllers/authController');

const { protegerRuta } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', registro);
router.post('/login', login);

// Rutas protegidas
router.get('/me', protegerRuta, obtenerUsuarioActual);
router.get('/profile', protegerRuta, obtenerPerfil);
router.put('/profile', protegerRuta, actualizarPerfil);

module.exports = router;