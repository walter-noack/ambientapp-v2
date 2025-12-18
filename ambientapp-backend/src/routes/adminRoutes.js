const express = require('express');
const router = express.Router();
const { protegerRuta, verificarAdmin } = require('../middleware/auth');
const {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerEstadisticasGenerales
} = require('../controllers/adminController');

// Todas las rutas requieren autenticación + rol admin
router.use(protegerRuta, verificarAdmin);

// Rutas de administración de usuarios
router.get('/users', listarUsuarios);
router.get('/users/:id', obtenerUsuario);
router.put('/users/:id', actualizarUsuario);
router.delete('/users/:id', eliminarUsuario);

// Ruta de estadísticas generales del sistema
router.get('/stats', obtenerEstadisticasGenerales);

module.exports = router;