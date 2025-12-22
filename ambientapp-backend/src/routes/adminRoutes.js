const express = require('express');
const router = express.Router();
const { protegerRuta, verificarAdmin } = require('../middleware/auth');
const {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerEstadisticasGenerales,
  crearUsuarioAdmin, 
  reenviarEmailVerificacion
} = require('../controllers/adminController');

// Todas las rutas requieren autenticación + rol admin
router.use(protegerRuta, verificarAdmin);

// Rutas de administración de usuarios
router.post('/users', crearUsuarioAdmin);
router.get('/users', listarUsuarios);
router.get('/users/:id', obtenerUsuario);
router.put('/users/:id', actualizarUsuario);
router.delete('/users/:id', eliminarUsuario);
router.post('/users/:id/resend-verification', reenviarEmailVerificacion);

// Ruta de estadísticas generales del sistema
router.get('/stats', obtenerEstadisticasGenerales);

module.exports = router;