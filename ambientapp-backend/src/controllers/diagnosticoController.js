const Diagnostico = require('../models/Diagnostico');
const User = require('../models/User');

// @desc    Crear nuevo diagnóstico
// @route   POST /api/diagnosticos
// @access  Private
const crearDiagnostico = async (req, res) => {
  try {
    const usuario = req.user;
    
    // Verificar si puede hacer diagnósticos (límite del plan)
    if (!usuario.puedeHacerDiagnostico()) {
      return res.status(403).json({
        success: false,
        message: 'Has alcanzado el límite de diagnósticos de tu plan',
        planActual: usuario.tipoSuscripcion,
        diagnosticosRealizados: usuario.limites.diagnosticosRealizados,
        diagnosticosTotales: usuario.limites.diagnosticosMes
      });
    }
    
    // Extraer datos del body
    const {
      companyName,
      semestre,
      anio,
      fechaEvaluacion,
      dimensiones,
      carbono,
      agua,
      residuos,
      productosREP,
      estado,
      notas
    } = req.body;
    
    // Validar datos básicos
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la empresa es obligatorio'
      });
    }
    
    // Crear diagnóstico
    const diagnostico = await Diagnostico.create({
      usuario: usuario._id,
      companyName,
      semestre: semestre || 'S1',
      anio: anio || new Date().getFullYear(),
      fechaEvaluacion: fechaEvaluacion || Date.now(),
      dimensiones: dimensiones || { carbono: true, agua: true, residuos: true, rep: false },
      carbono: carbono || {},
      agua: agua || {},
      residuos: residuos || {},
      productosREP: productosREP || [],
      estado: estado || 'completado',
      notas: notas || ''
    });
    
    // Calcular puntuaciones
    diagnostico.calcularPuntuacionGeneral();
    
    // Generar recomendaciones según plan del usuario
    diagnostico.generarRecomendaciones(usuario.tipoSuscripcion);
    
    // Guardar con cálculos
    await diagnostico.save();
    
    // Registrar uso de diagnóstico (solo cuenta para plan Free)
    await usuario.registrarDiagnostico();
    
    res.status(201).json({
      success: true,
      message: 'Diagnóstico creado exitosamente',
      data: {
        diagnostico
      }
    });
    
  } catch (error) {
    console.error('Error al crear diagnóstico:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear diagnóstico',
      error: error.message
    });
  }
};

// @desc    Obtener todos los diagnósticos del usuario
// @route   GET /api/diagnosticos
// @access  Private
const obtenerDiagnosticos = async (req, res) => {
  try {
    const usuario = req.user;
    
    // Parámetros de filtrado y paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtros opcionales
    const filtros = { usuario: usuario._id };
    
    if (req.query.companyName) {
      filtros.companyName = { $regex: req.query.companyName, $options: 'i' };
    }
    
    if (req.query.anio) {
      filtros.anio = parseInt(req.query.anio);
    }
    
    if (req.query.semestre) {
      filtros.semestre = req.query.semestre;
    }
    
    if (req.query.estado) {
      filtros.estado = req.query.estado;
    }
    
    // Obtener diagnósticos
    const diagnosticos = await Diagnostico.find(filtros)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Contar total para paginación
    const total = await Diagnostico.countDocuments(filtros);
    
    res.status(200).json({
      success: true,
      data: {
        diagnosticos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Error al obtener diagnósticos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener diagnósticos',
      error: error.message
    });
  }
};

// @desc    Obtener un diagnóstico específico
// @route   GET /api/diagnosticos/:id
// @access  Private
const obtenerDiagnosticoPorId = async (req, res) => {
  try {
    const usuario = req.user;
    const { id } = req.params;
    
    // Buscar diagnóstico
    const diagnostico = await Diagnostico.findById(id);
    
    if (!diagnostico) {
      return res.status(404).json({
        success: false,
        message: 'Diagnóstico no encontrado'
      });
    }
    
    // Verificar que el diagnóstico pertenece al usuario
    if (diagnostico.usuario.toString() !== usuario._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este diagnóstico'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        diagnostico
      }
    });
    
  } catch (error) {
    console.error('Error al obtener diagnóstico:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener diagnóstico',
      error: error.message
    });
  }
};

// @desc    Actualizar diagnóstico
// @route   PUT /api/diagnosticos/:id
// @access  Private
const actualizarDiagnostico = async (req, res) => {
  try {
    const usuario = req.user;
    const { id } = req.params;
    
    // Buscar diagnóstico
    const diagnostico = await Diagnostico.findById(id);
    
    if (!diagnostico) {
      return res.status(404).json({
        success: false,
        message: 'Diagnóstico no encontrado'
      });
    }
    
    // Verificar que el diagnóstico pertenece al usuario
    if (diagnostico.usuario.toString() !== usuario._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este diagnóstico'
      });
    }
    
    // Actualizar campos
    const camposActualizables = [
      'companyName', 'semestre', 'anio', 'fechaEvaluacion',
      'dimensiones', 'carbono', 'agua', 'residuos', 
      'productosREP', 'estado', 'notas'
    ];
    
    camposActualizables.forEach(campo => {
      if (req.body[campo] !== undefined) {
        diagnostico[campo] = req.body[campo];
      }
    });
    
    // Recalcular puntuaciones
    diagnostico.calcularPuntuacionGeneral();
    
    // Regenerar recomendaciones
    diagnostico.generarRecomendaciones(usuario.tipoSuscripcion);
    
    // Guardar
    await diagnostico.save();
    
    res.status(200).json({
      success: true,
      message: 'Diagnóstico actualizado exitosamente',
      data: {
        diagnostico
      }
    });
    
  } catch (error) {
    console.error('Error al actualizar diagnóstico:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar diagnóstico',
      error: error.message
    });
  }
};

// @desc    Eliminar diagnóstico
// @route   DELETE /api/diagnosticos/:id
// @access  Private
const eliminarDiagnostico = async (req, res) => {
  try {
    const usuario = req.user;
    const { id } = req.params;
    
    // Buscar diagnóstico
    const diagnostico = await Diagnostico.findById(id);
    
    if (!diagnostico) {
      return res.status(404).json({
        success: false,
        message: 'Diagnóstico no encontrado'
      });
    }
    
    // Verificar que el diagnóstico pertenece al usuario
    if (diagnostico.usuario.toString() !== usuario._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este diagnóstico'
      });
    }
    
    // Eliminar
    await Diagnostico.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Diagnóstico eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar diagnóstico:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar diagnóstico',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas de diagnósticos del usuario
// @route   GET /api/diagnosticos/estadisticas
// @access  Private
const obtenerEstadisticas = async (req, res) => {
  try {
    const usuario = req.user;
    
    // Total de diagnósticos
    const total = await Diagnostico.countDocuments({ usuario: usuario._id });
    
    // Por año
    const porAnio = await Diagnostico.aggregate([
      { $match: { usuario: usuario._id } },
      { $group: { _id: '$anio', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    
    // Puntuación promedio
    const promedios = await Diagnostico.aggregate([
      { $match: { usuario: usuario._id } },
      {
        $group: {
          _id: null,
          promedioGeneral: { $avg: '$puntuacionGeneral' },
          promedioCarbono: { $avg: '$carbono.puntuacion' },
          promedioAgua: { $avg: '$agua.puntuacion' },
          promedioResiduos: { $avg: '$residuos.puntuacion' },
          promedioREP: { $avg: '$repPuntuacion' }
        }
      }
    ]);
    
    // Nivel de desempeño más común
    const niveles = await Diagnostico.aggregate([
      { $match: { usuario: usuario._id } },
      { $group: { _id: '$nivelDesempeno', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total,
        porAnio,
        promedios: promedios[0] || {},
        niveles,
        planInfo: usuario.getInfoPlan()
      }
    });
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

module.exports = {
  crearDiagnostico,
  obtenerDiagnosticos,
  obtenerDiagnosticoPorId,
  actualizarDiagnostico,
  eliminarDiagnostico,
  obtenerEstadisticas
};