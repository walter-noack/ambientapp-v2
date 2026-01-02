// Importar dependencias
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan'); // opcional, para logs más limpios
const contactRoutes = require('./src/routes/contact');

// Inicializar app
const app = express();

// Middleware para loguear todas las peticiones (incluye OPTIONS)
app.use((req, res, next) => {
  console.log(`Petición recibida: ${req.method} ${req.originalUrl}`);
  next();
});

console.log('🔥 Backend arrancado con configuración CORS actualizada');

// Construir lista de orígenes permitidos para CORS
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

// Configuración CORS con función dinámica para origin
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // permitir peticiones sin origin (Postman, curl)
    if (allowedOrigins.includes(origin)) {
      callback(null, origin); // IMPORTANTE: devolver el origen, no '*'
    } else {
      callback(new Error('CORS_NOT_ALLOWED'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares para parsear body (JSON y urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging (solo en dev)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Conectar a MongoDB
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
      admin: '/api/admin'
    }
  });
});

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/diagnosticos', diagnosticoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contacto', contactRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error del servidor'
  });
});

// Puerto
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   - GET  /`);
  console.log(`   - POST /api/auth/registro`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/me`);
  console.log(`   - GET  /api/auth/profile`);
  console.log(`   - PUT  /api/auth/profile`);
  console.log(`   - POST /api/diagnosticos`);
  console.log(`   - GET  /api/diagnosticos`);
  console.log(`   - GET  /api/diagnosticos/:id`);
  console.log(`   - PUT  /api/diagnosticos/:id`);
  console.log(`   - DELETE /api/diagnosticos/:id`);
  console.log(`   - GET  /api/diagnosticos/estadisticas`);
  console.log(`   - GET  /api/admin/users`);
  console.log(`   - GET  /api/admin/users/:id`);
  console.log(`   - PUT  /api/admin/users/:id`);
  console.log(`   - DELETE /api/admin/users/:id`);
  console.log(`   - GET  /api/admin/stats`);
});