const User = require('../models/User');
const { generarToken } = require('../utils/jwt'); // tu helper actual
const { sendVerificationEmail } = require('../utils/email'); // util nodemailer

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

    // Generar token de verificación y guardarlo
    const tokenVerificacion = user.generarTokenVerificacion(24); // 24h
    await user.save();

    // Enviar email de verificación (no bloqueante)
    try {
      await sendVerificationEmail(user, tokenVerificacion);
    } catch (err) {
      console.error('Error enviando email de verificación:', err);
      // No bloqueamos el registro por fallo de email — informar al cliente
    }

    // Verificar y resetear límites (por si acaso)
    user.verificarYResetearLimites();

    // Generar token JWT
    const token = generarToken(user._id);

    // Responder con usuario y token
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.',
      data: {
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
          empresa: user.empresa,
          tipoSuscripcion: user.tipoSuscripcion,
          role: user.role,
          features: user.features,
          planInfo: user.planInfo,
          emailVerificado: user.emailVerificado
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

    console.log('Intento de login para:', email);

    // Buscar usuario (incluir password para comparar)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('Login fallido: usuario no encontrado');
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar password
    const passwordValido = await user.compararPassword(password);

    if (!passwordValido) {
      console.log('Login fallido: contraseña incorrecta para', email);
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // NOTA: Permitimos el login aunque emailVerificado === false.
    // Si en el futuro quieres bloquear inicio de sesión hasta verificar,
    // vuelve a agregar la comprobación aquí.

    // Verificar y resetear límites antes de devolver info
    user.verificarYResetearLimites();

    // Actualizar último acceso
    user.ultimoAcceso = Date.now();
    await user.save();

    // Generar token JWT
    const token = generarToken(user._id);

    // Responder (incluimos emailVerificado)
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
          estadoSuscripcion: user.estadoSuscripcion,
          role: user.role,
          features: user.features,
          planInfo: user.planInfo,
          emailVerificado: user.emailVerificado,
          ultimoAcceso: user.ultimoAcceso,
          createdAt: user.createdAt
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
          planInfo: user.planInfo,
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

// ---------------------------------------------------------
// Verificar email -- acepta POST { token } o GET ?token=...
// ---------------------------------------------------------
const verifyEmail = async (req, res) => {
  try {
    // soportar token en body (POST) o en query (GET)
    const token = (req.body && req.body.token) || req.query.token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token es requerido'
      });
    }

    // Buscar usuario por el token
    const user = await User.findOne({
      verificationToken: token
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // comprobar expiración si existiera el campo de expiración
    if (user.verificationTokenExpires && user.verificationTokenExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Marcar como verificado
    user.emailVerificado = true;
    user.clearVerificationToken();
    await user.save();

    // Si la petición fue GET (link directo), redirigir al frontend con status
    if (req.method === 'GET') {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl.replace(/\/$/, '')}/verify-email?status=success`);
    }

    return res.status(200).json({
      success: true,
      message: 'Correo verificado correctamente'
    });
  } catch (error) {
    console.error('Error en verifyEmail:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ---------------------------------------------------------
// Reenviar email de verificación
// POST /api/auth/resend-verification  { email }  (público)
// ---------------------------------------------------------
const resendVerification = async (req, res) => {
  try {
    const { email, userId } = req.body;

    let user = null;
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      return res.status(400).json({ success: false, message: 'Proporciona email o userId' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (user.emailVerificado) {
      return res.status(400).json({ success: false, message: 'El correo ya está verificado' });
    }

    const token = user.generarTokenVerificacion(24);
    await user.save();

    await sendVerificationEmail(user, token);

    return res.status(200).json({
      success: true,
      message: 'Email de verificación reenviado'
    });
  } catch (error) {
    console.error('Error en resendVerification:', error);
    return res.status(500).json({ success: false, message: 'Error interno al reenviar email' });
  }
};

module.exports = {
  registro,
  login,
  obtenerPerfil,
  obtenerUsuarioActual,
  actualizarPerfil,
  verifyEmail,
  resendVerification
};