// migrateProFeatures.js
const mongoose = require('mongoose');
const User = require('./ambientapp_backend/src/models/User'); // Ruta corregida

const MONGO = 'mongodb+srv://wnoack_db_user:9ThOaZEQbWaQXFYU@clusterambientappv2.rgcjwib.mongodb.net/ambientappv2?retryWrites=true&w=majority';

async function run() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    const pros = await User.find({ tipoSuscripcion: 'pro' });
    console.log(`Usuarios Pro encontrados: ${pros.length}`);

    for (const u of pros) {
      if (typeof u.actualizarAPro === 'function') {
        await u.actualizarAPro();
        await u.save();
        console.log(`Actualizado features para user ${u.email}`);
      } else {
        u.features = u.features || {};
        u.features.exportarPDF = true;
        u.features.recomendacionesCompletas = true;
        u.features.evolucionTemporal = true;
        u.features.soportePrioritario = true;
        await u.save();
        console.log(`Set manual features para ${u.email}`);
      }
    }

    console.log('Migración completada.');
    process.exit(0);
  } catch (err) {
    console.error('Error migrando:', err);
    process.exit(1);
  }
}

run();