// Importar dependencias
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan'); // opcional, para logs más limpios
const contactRoutes = require('./src/routes/contact');

// Inicializar app
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // para parsear JSON


// Middleware de logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // logs automáticos en desarrollo
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