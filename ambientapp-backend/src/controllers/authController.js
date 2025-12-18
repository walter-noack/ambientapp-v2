const User = require('../models/User');
const { generarToken } = require('../utils/jwt');

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/registro
// @access  Public
const registro = async (req, res) => {
  try {
    const { nombre, email, password, empresa, rut, telefono } = req.body;
    
    // Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona nombre, email y contraseña'
      });
    }
    
    // Verificar si el usuario ya existe
    const usuarioExiste = await User.findOne({ email });
    
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }
    
    // Crear usuario
    const user = await User.create({
      nombre,
      email,
      password,
      empresa,
      rut,
      telefono
    });
    
    // Generar token
    const token = generarToken(user._id);
    
    // Responder con usuario y token
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
          empresa: user.empresa,
          tipoSuscripcion: user.tipoSuscripcion,
          features: user.features,
          planInfo: user.getInfoPlan()
        },
        token
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona email y contraseña'
      });
    }
    
    // Buscar usuario (incluir password para comparar)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar password
    const passwordValido = await user.compararPassword(password);
    
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar estado de suscripción
    if (user.estadoSuscripcion !== 'activa') {
      return res.status(403).json({
        success: false,
        message: 'Tu suscripción está suspendida o cancelada'
      });
    }
    
    // Actualizar último acceso
    user.ultimoAcceso = Date.now();
    await user.save();
    
    // Generar token
    const token = generarToken(user._id);
    
    // Responder
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
          empresa: user.empresa,
          tipoSuscripcion: user.tipoSuscripcion,
          features: user.features,
          planInfo: user.getInfoPlan()
        },
        token
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
const obtenerPerfil = async (req, res) => {
  try {
    const user = req.user;
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
          empresa: user.empresa,
          rut: user.rut,
          telefono: user.telefono,
          tipoSuscripcion: user.tipoSuscripcion,
          estadoSuscripcion: user.estadoSuscripcion,
          features: user.features,
          planInfo: user.getInfoPlan(),
          emailVerificado: user.emailVerificado,
          ultimoAcceso: user.ultimoAcceso,
          createdAt: user.createdAt
        }
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

module.exports = {
  registro,
  login,
  obtenerPerfil
};