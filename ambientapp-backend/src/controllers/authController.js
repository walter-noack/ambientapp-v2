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
    
    // Verificar y resetear límites (por si acaso)
    user.verificarYResetearLimites();
    
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
          role: user.role,
          features: user.features,
          planInfo: user.planInfo // ✅ usar virtual en lugar de método
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Error al registrar usuario:', error);
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
    
    // Verificar y resetear límites antes de devolver info
    user.verificarYResetearLimites();
    
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
          role: user.role,
          features: user.features,
          planInfo: user.planInfo // ✅ usar virtual en lugar de método
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/profile
// @access  Private
const obtenerPerfil = async (req, res) => {
  try {
    // req.user viene del middleware de autenticación
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Verificar y resetear límites antes de devolver
    user.verificarYResetearLimites();
    await user.save(); // Guardar si hubo reset
    
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
          role: user.role,
          features: user.features,
          planInfo: user.planInfo, // ✅ incluye planInfo automáticamente
          emailVerificado: user.emailVerificado,
          ultimoAcceso: user.ultimoAcceso,
          createdAt: user.createdAt
        }
      }
    });
    
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

// @desc    Obtener usuario actual (alias de obtenerPerfil para /api/auth/me)
// @route   GET /api/auth/me
// @access  Private
const obtenerUsuarioActual = async (req, res) => {
  try {
    const user = req.user;
    
    // Verificar y resetear límites
    user.verificarYResetearLimites();
    
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
          role: user.role,
          features: user.features,
          planInfo: user.planInfo,
          emailVerificado: user.emailVerificado,
          ultimoAcceso: user.ultimoAcceso,
          createdAt: user.createdAt
        }
      }
    });
    
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/auth/profile
// @access  Private
const actualizarPerfil = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Campos actualizables
    const camposPermitidos = ['nombre', 'empresa', 'rut', 'telefono'];
    
    camposPermitidos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        user[campo] = req.body[campo];
      }
    });
    
    await user.save();
    
    // Verificar límites antes de devolver
    user.verificarYResetearLimites();
    
    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
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
          role: user.role,
          features: user.features,
          planInfo: user.planInfo,
          emailVerificado: user.emailVerificado,
          ultimoAcceso: user.ultimoAcceso,
          createdAt: user.createdAt
        }
      }
    });
    
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

module.exports = {
  registro,
  login,
  obtenerPerfil,
  obtenerUsuarioActual,
  actualizarPerfil
};