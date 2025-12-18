const express = require('express');
const router = express.Router();
const {
  crearDiagnostico,
  obtenerDiagnosticos,
  obtenerDiagnosticoPorId,
  actualizarDiagnostico,
  eliminarDiagnostico,
  obtenerEstadisticas
} = require('../controllers/diagnosticoController');
const { protegerRuta, verificarLimiteDiagnosticos } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(protegerRuta);

// Ruta de estadísticas (debe ir ANTES de /:id para evitar conflictos)
router.get('/estadisticas', obtenerEstadisticas);

// Rutas CRUD
router.post('/', verificarLimiteDiagnosticos, crearDiagnostico);
router.get('/', obtenerDiagnosticos);
router.get('/:id', obtenerDiagnosticoPorId);
router.put('/:id', actualizarDiagnostico);
router.delete('/:id', eliminarDiagnostico);

module.exports = router;