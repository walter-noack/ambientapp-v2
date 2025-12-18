const express = require('express');
const router = express.Router();
const { registro, login, obtenerPerfil } = require('../controllers/authController');
const { protegerRuta } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', registro);
router.post('/login', login);

// Rutas protegidas
router.get('/me', protegerRuta, obtenerPerfil);

module.exports = router;