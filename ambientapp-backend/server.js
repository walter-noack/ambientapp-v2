// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const contactRoutes = require('./src/routes/contact');

const app = express();

/* =========================
   Construcción lista orígenes
   ========================= */
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

console.log('🔥 Backend arrancado (iniciando middlewares). Allowed origins:', allowedOrigins);

/* =========================
   Middleware CORS FUERTE (lo más arriba posible)
   ========================= */
app.use((req, res, next) => {
  const origin = req.get('Origin');
  console.log(`[CORS CHECK] ${new Date().toISOString()} ${req.method} ${req.originalUrl} - Origin: ${origin}`);

  if (!origin) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return next();
  }

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept');
  } else {
    console.log(`[CORS REJECT] Origin no permitido: ${origin}`);
  }

  if (req.method === 'OPTIONS') {
    if (!allowedOrigins.includes(origin)) {
      return res.status(403).end();
    }
    return res.status(204).end();
  }

  next();
});

/* =========================
   Registrar cors() por compatibilidad
   ========================= */
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, origin);
    return callback(null, false);
  },
  credentials: true
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // Si origin permitido, responder con headers CORS y 204
    const origin = req.get('Origin');
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept');
      return res.sendStatus(204);
    }
    // Si origin no permitido, responder 403
    return res.sendStatus(403);
  }
  next();
});

/* =========================
   Ruta de test para debug CORS
   ========================= */
app.get('/__test_cors', (req, res) => {
  const origin = req.get('Origin') || null;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.json({ ok: true, origin });
});

/* =========================
   Body parsers y logging
   ========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* =========================
   DB connect
   ========================= */
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

/* =========================
   Rutas
   ========================= */
const authRoutes = require('./src/routes/authRoutes');
const diagnosticoRoutes = require('./src/routes/diagnosticoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

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

app.use('/api/auth', authRoutes);
app.use('/api/diagnosticos', diagnosticoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contacto', contactRoutes);

/* =========================
   Manejo de errores global
   ========================= */
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

/* =========================
   Arranque
   ========================= */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});