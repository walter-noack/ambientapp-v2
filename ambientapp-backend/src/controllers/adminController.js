const User = require('../models/User');
const Diagnostico = require('../models/Diagnostico');

// @desc    Listar todos los usuarios (con filtros)
// @route   GET /api/admin/users
// @access  Private/Admin
const listarUsuarios = async (req, res) => {
  try {
    const { plan, estado, busqueda, ordenar = 'reciente', page = 1, limit = 20 } = req.query;
    
    // Construir filtro
    let filtro = {};
    
    if (plan && plan !== 'todos') {
      filtro.tipoSuscripcion = plan;
    }
    
    if (estado && estado !== 'todos') {
      filtro.estadoSuscripcion = estado;
    }
    
    if (busqueda) {
      filtro.$or = [
        { nombre: { $regex: busqueda, $options: 'i' } },
        { email: { $regex: busqueda, $options: 'i' } },
        { empresa: { $regex: busqueda, $options: 'i' } }
      ];
    }
    
    // Configurar ordenamiento
    let sort = {};
    switch (ordenar) {
      case 'reciente':
        sort = { createdAt: -1 };
        break;
      case 'antiguo':
        sort = { createdAt: 1 };
        break;
      case 'nombre':
        sort = { nombre: 1 };
        break;
      case 'email':
        sort = { email: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
    
    // Paginación
    const skip = (page - 1) * limit;
    
    // Obtener usuarios
    const usuarios = await User.find(filtro)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Contar total
    const total = await User.countDocuments(filtro);
    
    // Agregar estadísticas por usuario
    const usuariosConStats = await Promise.all(
      usuarios.map(async (user) => {
        const diagnosticosCount = await Diagnostico.countDocuments({ usuario: user._id });
        return {
          ...user.toObject(),
          diagnosticosRealizados: diagnosticosCount
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: {
        usuarios: usuariosConStats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al listar usuarios',
      error: error.message
    });
  }
};

// @desc    Obtener detalles de un usuario
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await User.findById(id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Obtener diagnósticos del usuario
    const diagnosticos = await Diagnostico.find({ usuario: id })
      .select('companyName puntuacionGeneral nivelDesempeno createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const diagnosticosCount = await Diagnostico.countDocuments({ usuario: id });
    
    res.status(200).json({
      success: true,
      data: {
        usuario: {
          ...usuario.toObject(),
          planInfo: usuario.getInfoPlan()
        },
        diagnosticos,
        diagnosticosCount
      }
    });
    
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

// @desc    Actualizar usuario (cambiar plan, suspender, etc.)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoSuscripcion, estadoSuscripcion, limites, features, notas } = req.body;
    
    const usuario = await User.findById(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Actualizar campos permitidos
    if (tipoSuscripcion) {
      if (tipoSuscripcion === 'pro' && usuario.tipoSuscripcion !== 'pro') {
        // Upgrade a Pro
        await usuario.actualizarAPro();
      } else {
        usuario.tipoSuscripcion = tipoSuscripcion;
        
        // Si downgrade a Free, restaurar límites
        if (tipoSuscripcion === 'free') {
          usuario.limites.diagnosticosMes = 4;
          usuario.limites.maxUsuarios = 1;
          usuario.features.exportarPDF = false;
          usuario.features.recomendacionesCompletas = false;
          usuario.features.evolucionTemporal = false;
          usuario.features.soportePrioritario = false;
        }
      }
    }
    
    if (estadoSuscripcion) {
      usuario.estadoSuscripcion = estadoSuscripcion;
    }
    
    if (limites) {
      usuario.limites = { ...usuario.limites, ...limites };
    }
    
    if (features) {
      usuario.features = { ...usuario.features, ...features };
    }
    
    await usuario.save();
    
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: {
        usuario: {
          ...usuario.toObject(),
          planInfo: usuario.getInfoPlan()
        }
      }
    });
    
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

// @desc    Eliminar usuario (y sus diagnósticos)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await User.findById(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Eliminar todos los diagnósticos del usuario
    await Diagnostico.deleteMany({ usuario: id });
    
    // Eliminar usuario
    await User.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas generales del sistema
// @route   GET /api/admin/stats
// @access  Private/Admin
const obtenerEstadisticasGenerales = async (req, res) => {
  try {
    // Usuarios
    const totalUsuarios = await User.countDocuments();
    const usuariosFree = await User.countDocuments({ tipoSuscripcion: 'free' });
    const usuariosPro = await User.countDocuments({ tipoSuscripcion: 'pro' });
    const usuariosActivos = await User.countDocuments({ estadoSuscripcion: 'activa' });
    
    // Diagnósticos
    const totalDiagnosticos = await Diagnostico.countDocuments();
    const diagnosticosUltimoMes = await Diagnostico.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    // Usuarios nuevos último mes
    const usuariosNuevos = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    // Promedio de diagnósticos por usuario
    const promedioDiagnosticosPorUsuario = totalUsuarios > 0 
      ? (totalDiagnosticos / totalUsuarios).toFixed(2) 
      : 0;
    
    res.status(200).json({
      success: true,
      data: {
        usuarios: {
          total: totalUsuarios,
          free: usuariosFree,
          pro: usuariosPro,
          activos: usuariosActivos,
          nuevosUltimoMes: usuariosNuevos
        },
        diagnosticos: {
          total: totalDiagnosticos,
          ultimoMes: diagnosticosUltimoMes,
          promedioPorUsuario: promedioDiagnosticosPorUsuario
        }
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
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerEstadisticasGenerales
};