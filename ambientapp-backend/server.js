// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const contactRoutes = require('./src/routes/contact');

const app = express();

// --- Construir lista de orígenes permitidos ---
const buildAllowedOrigins = () => {
  const origins = new Set();

  if (process.env.FRONTEND_URL) origins.add(process.env.FRONTEND_URL);

  if (process.env.FRONTEND_URL_EXTRA) {
    process.env.FRONTEND_URL_EXTRA.split(',').forEach(s => {
      const t = s.trim();
      if (t) origins.add(t);
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:5173');
    origins.add('http://localhost:3000');
  }

  // Añadir variantes www
  const snapshot = Array.from(origins);
  snapshot.forEach(o => {
    if (o && o.startsWith('https://') && !o.includes('www.')) {
      origins.add(o.replace('https://', 'https://www.'));
    }
    if (o && o.startsWith('http://') && !o.includes('www.')) {
      origins.add(o.replace('http://', 'http://www.'));
    }
  });

  return Array.from(origins);
};

const allowedOrigins = buildAllowedOrigins();
// Asegurarse de incluir explícitamente tu dominio (por si la env no está)
if (!allowedOrigins.includes('https://ambientapp.cl')) allowedOrigins.push('https://ambientapp.cl');
if (!allowedOrigins.includes('https://www.ambientapp.cl')) allowedOrigins.push('https://www.ambientapp.cl');

// --- Log de arranque rápido ---
console.log('🔥 Backend arrancado con configuración CORS actualizada');
console.log('Allowed origins:', allowedOrigins);

// --- Middleware de logging simple (early) ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Origin: ${req.get('Origin')}`);
  next();
});

// --- CORS config dinámica ---
const corsOptions = {
  origin: function (origin, callback) {
    // Log para depuración
    console.log('CORS check origin =>', origin);
    if (!origin) {
      // permitir herramientas sin Origin (curl, Postman) o same-origin server-side
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      // devolver el origen exacto (necesario si se usan credentials)
      return callback(null, origin);
    }
    // Rechazar origen (no lanzar error aquí)
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

// Registrar CORS globalmente
app.use(cors(corsOptions));

// Asegurar que las peticiones OPTIONS obtengan las cabeceras CORS
// Usamos '/*' para evitar problemas con path-to-regexp en algunas versiones
app.options('/*', cors(corsOptions));

// Ruta test para validar CORS desde cliente o curl
app.get('/__test_cors', cors(corsOptions), (req, res) => {
  const origin = req.get('Origin') || null;
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.json({ ok: true, origin });
});

// --- Body parsers ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Logging adicional en dev ---
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- DB connect ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error.message);
    process.exit(1);
  }
};
connectDB();

// --- Importar rutas ---
const authRoutes = require('./src/routes/authRoutes');
const diagnosticoRoutes = require('./src/routes/diagnosticoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// --- Root ---
app.get('/', (req, res) => {
  res.json({
    message: '🌱 AmbientApp Backend API',
    version: '2.0',
    status: 'OK',
    endpoints: {
      auth: '/api/auth',
      diagnosticos: '/api/diagnosticos',
      admin: '/api/admin'
    }
  });
});

// --- Montar rutas (usa prefijo /api en authRoutes) ---
app.use('/api/auth', authRoutes);
app.use('/api/diagnosticos', diagnosticoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contacto', contactRoutes);

// --- Manejo de errores global (último) ---
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err && err.message ? err.message : err);
  if (err && err.message === 'CORS_NOT_ALLOWED') {
    return res.status(403).json({ success: false, message: 'Origen no permitido por CORS' });
  }
  res.status(err && err.status ? err.status : 500).json({
    success: false,
    message: err && err.message ? err.message : 'Error del servidor'
  });
});

// --- Arranque ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});