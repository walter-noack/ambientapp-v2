// controllers/adminController.js
const User = require('../models/User');
const Diagnostico = require('../models/Diagnostico');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configura tu transporte SMTP (ajusta según tu configuración)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.ambientapp.cl',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
  secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true,
  auth: {
    user: process.env.SMTP_USER || 'hola@ambientapp.cl',
    pass: process.env.SMTP_PASS,
  },
});

// ----- crearUsuarioAdmin -----
const crearUsuarioAdmin = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      empresa,
      rut,
      telefono,
      role = 'user',
      tipoSuscripcion = 'free',
      estadoSuscripcion = 'activa',
      validezTemporalTipo = 'ilimitado'
    } = req.body;

    // Validaciones mínimas
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona nombre, email y contraseña'
      });
    }

    // Verificar si existe
    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const nuevoUsuario = await User.create({
      nombre,
      email,
      password, // el schema lo hashea en pre('save')
      empresa,
      rut,
      telefono,
      role,
      tipoSuscripcion,
      estadoSuscripcion
    });

    // Si el usuario es Pro, actualizar features
    if (tipoSuscripcion === 'pro') {
      await nuevoUsuario.actualizarAPro();
    }

    // Establecer validez temporal si se especifica
    if (validezTemporalTipo && validezTemporalTipo !== 'ilimitado') {
      nuevoUsuario.establecerValidezTemporal(validezTemporalTipo);
    }

    // Verificar/resetear límites si el método existe
    if (typeof nuevoUsuario.verificarYResetearLimites === 'function') {
      nuevoUsuario.verificarYResetearLimites();
      await nuevoUsuario.save();
    }

    res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      data: {
        usuario: {
          ...nuevoUsuario.toObject(),
          password: undefined,
          planInfo: nuevoUsuario.planInfo,
          isVerified: nuevoUsuario.emailVerificado
        }
      }
    });
  } catch (error) {
    console.error('Error crearUsuarioAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

// ----- listarUsuarios -----
const listarUsuarios = async (req, res) => {
  try {
    // aceptar 'busqueda' (es) o 'search' (en)
    const {
      plan,
      estado,
      busqueda,
      search,
      ordenar = 'reciente',
      page = 1,
      limit = 20,
      verified
    } = req.query;

    const terminoBusqueda = busqueda || search;

    // Construir filtro
    let filtro = {};

    if (plan && plan !== 'todos') {
      filtro.tipoSuscripcion = plan;
    }

    if (estado && estado !== 'todos') {
      filtro.estadoSuscripcion = estado;
    }

    // expected: 'verificados' | 'no_verificados' | 'todos'
    if (typeof verified !== 'undefined' && verified !== 'todos') {
      if (verified === 'verificados') filtro.emailVerificado = true;
      if (verified === 'no_verificados') filtro.emailVerificado = false;
    }

    if (terminoBusqueda) {
      filtro.$or = [
        { nombre: { $regex: terminoBusqueda, $options: 'i' } },
        { email: { $regex: terminoBusqueda, $options: 'i' } },
        { empresa: { $regex: terminoBusqueda, $options: 'i' } }
      ];
    }

    // Orden
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

    const total = await User.countDocuments(filtro);

    // Agregar estadísticas por usuario y mapear emailVerificado => isVerified
    const usuariosConStats = await Promise.all(
      usuarios.map(async (user) => {
        const diagnosticosCount = await Diagnostico.countDocuments({ usuario: user._id });
        const uObj = user.toObject();
        uObj.diagnosticosRealizados = diagnosticosCount;
        // garantizar compatibilidad con frontend que espera isVerified
        uObj.isVerified = !!uObj.emailVerificado;
        return uObj;
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

// ----- obtenerUsuario -----
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
          planInfo: usuario.getInfoPlan(),
          isVerified: !!usuario.emailVerificado
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

// ----- actualizarUsuario -----
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoSuscripcion, estadoSuscripcion, limites, features, notas, role, isVerified, validezTemporalTipo } = req.body;

    const usuario = await User.findById(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (role) {
      usuario.role = role;
    }

    if (tipoSuscripcion) {
      if (tipoSuscripcion === 'pro' && usuario.tipoSuscripcion !== 'pro') {
        // Upgrade a Pro
        await usuario.actualizarAPro();
      } else if (tipoSuscripcion === 'free' && usuario.tipoSuscripcion !== 'free') {
        // Downgrade a Free
        usuario.tipoSuscripcion = 'free';
        usuario.limites.diagnosticosMes = 3;
        usuario.limites.maxUsuarios = 1;
        usuario.features.exportarPDF = false;
        usuario.features.recomendacionesCompletas = false;
        usuario.features.evolucionTemporal = false;
        usuario.features.soportePrioritario = false;
      } else {
        // Solo cambiar tipoSuscripcion si no es upgrade/downgrade
        usuario.tipoSuscripcion = tipoSuscripcion;
      }
    }

    if (estadoSuscripcion) {
      usuario.estadoSuscripcion = estadoSuscripcion;
    }

    if (validezTemporalTipo !== undefined) {
      if (validezTemporalTipo === 'ilimitado') {
        usuario.validezTemporal.tipo = 'ilimitado';
        usuario.validezTemporal.fechaExpiracion = null;
        usuario.validezTemporal.diasRestantes = null;
      } else {
        usuario.establecerValidezTemporal(validezTemporalTipo);
      }
    }

    if (limites) {
      usuario.limites = { ...usuario.limites, ...limites };
    }

    if (features) {
      usuario.features = { ...usuario.features, ...features };
    }

    if (typeof isVerified !== 'undefined') {
      usuario.emailVerificado = !!isVerified;
      if (!usuario.emailVerificado) {
        usuario.verificationToken = undefined;
        usuario.verificationTokenExpires = undefined;
      }
    }

    await usuario.save();

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: {
        usuario: {
          ...usuario.toObject(),
          planInfo: usuario.getInfoPlan(),
          isVerified: !!usuario.emailVerificado
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

// ----- eliminarUsuario -----
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

    await Diagnostico.deleteMany({ usuario: id });
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

// ----- obtenerEstadisticasGenerales -----
const obtenerEstadisticasGenerales = async (req, res) => {
  try {
    const totalUsuarios = await User.countDocuments();
    const usuariosFree = await User.countDocuments({ tipoSuscripcion: 'free' });
    const usuariosPro = await User.countDocuments({ tipoSuscripcion: 'pro' });
    const usuariosActivos = await User.countDocuments({ estadoSuscripcion: 'activa' });

    const totalDiagnosticos = await Diagnostico.countDocuments();
    const diagnosticosUltimoMes = await Diagnostico.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    const usuariosNuevos = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

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

// ----- reenviarEmailVerificacion -----
const reenviarEmailVerificacion = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findById(id);

    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (usuario.emailVerificado) {
      return res.status(400).json({ success: false, message: 'Usuario ya está verificado' });
    }

    // Generar token nuevo usando el método del modelo si existe
    let token = usuario.generarTokenVerificacion ? usuario.generarTokenVerificacion(24) : crypto.randomBytes(32).toString('hex');
    // Si el método generó token pero no guardó, guardarlo ahora
    usuario.verificationToken = token;
    usuario.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
    await usuario.save();

    // Construir link de verificación (ajusta URL frontend)
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    // Enviar email
    const mailOptions = {
      from: `"AmbientApp" <${process.env.SMTP_FROM || 'hola@ambientapp.cl'}>`,
      to: usuario.email,
      subject: 'Verifica tu correo en AmbientApp',
      text: `Hola ${usuario.nombre},\n\nPor favor verifica tu correo haciendo clic en el siguiente enlace:\n\n${verificationUrl}\n\nEste enlace expira en 24 horas.\n\nGracias!`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Email de verificación reenviado' });
  } catch (error) {
    console.error('Error reenviando email de verificación:', error);
    res.status(500).json({ success: false, message: 'Error enviando email de verificación' });
  }
};

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerEstadisticasGenerales,
  crearUsuarioAdmin,
  reenviarEmailVerificacion
};