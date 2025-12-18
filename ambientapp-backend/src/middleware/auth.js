const { verificarToken } = require('../utils/jwt');
const User = require('../models/User');

// Middleware para proteger rutas
const protegerRuta = async (req, res, next) => {
  try {
    // 1. Verificar que existe el token
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Token no proporcionado'
      });
    }
    
    // 2. Verificar el token
    const decoded = verificarToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    // 3. Buscar usuario
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // 4. Verificar que la suscripción esté activa
    if (user.estadoSuscripcion !== 'activa') {
      return res.status(403).json({
        success: false,
        message: 'Suscripción suspendida o cancelada'
      });
    }
    
    // 5. Agregar usuario al request
    req.user = user;
    next();
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en autenticación',
      error: error.message
    });
  }
};

// Middleware para verificar plan Pro
const verificarPlanPro = (req, res, next) => {
  if (req.user.tipoSuscripcion !== 'pro') {
    return res.status(403).json({
      success: false,
      message: 'Esta función requiere plan Pro',
      planActual: req.user.tipoSuscripcion
    });
  }
  next();
};

// Middleware para verificar si puede hacer diagnósticos
const verificarLimiteDiagnosticos = (req, res, next) => {
  if (!req.user.puedeHacerDiagnostico()) {
    return res.status(403).json({
      success: false,
      message: 'Has alcanzado el límite de diagnósticos mensuales',
      planActual: req.user.tipoSuscripcion,
      diagnosticosRealizados: req.user.limites.diagnosticosRealizados,
      diagnosticosTotales: req.user.limites.diagnosticosMes
    });
  }
  next();
};

// Middleware para verificar rol admin
const verificarAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }
  next();
};

module.exports = {
  protegerRuta,
  verificarPlanPro,
  verificarLimiteDiagnosticos,
  verificarAdmin
};