// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const contactRoutes = require('./src/routes/contact');

const app = express();

// Construcción lista orígenes permitidos
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
    if (!o) return;
    if (o.startsWith('https://') && !o.includes('www.')) {
      origins.add(o.replace('https://', 'https://www.'));
    }
    if (o.startsWith('http://') && !o.includes('www.')) {
      origins.add(o.replace('http://', 'http://www.'));
    }
  });

  return Array.from(origins);
};

const allowedOrigins = buildAllowedOrigins();
if (!allowedOrigins.includes('https://ambientapp.cl')) allowedOrigins.push('https://ambientapp.cl');
if (!allowedOrigins.includes('https://www.ambientapp.cl')) allowedOrigins.push('https://www.ambientapp.cl');

console.log('🔥 Backend arrancado. Allowed origins:', allowedOrigins);

// Middleware para loguear peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Origin: ${req.get('Origin')}`);
  next();
});

// Configuración CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));

// Manejo explícito de OPTIONS para todas las rutas con CORS
app.options('*', cors(corsOptions), (req, res) => {
  res.sendStatus(204);
});

// Middlewares para parsear body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging en desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Conexión a MongoDB
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

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const diagnosticoRoutes = require('./src/routes/diagnosticoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '🌱 AmbientApp Backend API',
    version: '2.0',
    status: 'OK',
    endpoints: {
      auth: '/api/auth',
      diagnosticos: '/api/diagnosticos',
      admin: '/api/admin',
    },
  });
});

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/diagnosticos', diagnosticoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contacto', contactRoutes);

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err && err.message ? err.message : err);
  if (err && err.message === 'CORS_NOT_ALLOWED') {
    return res.status(403).json({ success: false, message: 'Origen no permitido por CORS' });
  }
  res.status(err && err.status ? err.status : 500).json({
    success: false,
    message: err && err.message ? err.message : 'Error del servidor',
  });
});

// Arranque del servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});