// migrateProFeatures_update_test.js
// Ejecutar desde la raíz del repo: node migrateProFeatures_update_test.js

const mongoose = require('mongoose');

const MONGO = 'mongodb+srv://wnoack_db_user:9ThOaZEQbWaQXFYU@clusterambientappv2.rgcjwib.mongodb.net/test?retryWrites=true&w=majority';

async function run() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGO);

    const db = mongoose.connection.db;
    const collectionName = 'users';
    const collection = db.collection(collectionName);

    // Conteos previos
    const totalUsers = await collection.countDocuments();
    const totalProsBefore = await collection.countDocuments({ tipoSuscripcion: 'pro' });
    const prosWithFeatureBefore = await collection.countDocuments({ tipoSuscripcion: 'pro', 'features.exportarPDF': true });

    console.log(`Colección '${collectionName}': total documentos=${totalUsers}`);
    console.log(`Usuarios con tipoSuscripcion='pro' (antes): ${totalProsBefore}`);
    console.log(`Usuarios Pro con exportarPDF=true (antes): ${prosWithFeatureBefore}`);

    // Mostrar algunos Pro (previo) para inspección (limit 10)
    const sampleProsBefore = await collection.find({ tipoSuscripcion: 'pro' }).limit(10).toArray();
    console.log('Ejemplo usuarios Pro (antes):', sampleProsBefore);

    // Actualización: setear features para Pro que no las tienen
    const filter = {
      tipoSuscripcion: 'pro',
      $or: [
        { 'features.exportarPDF': { $exists: false } },
        { 'features.exportarPDF': false }
      ]
    };

    const update = {
      $set: {
        'features.exportarPDF': true,
        'features.recomendacionesCompletas': true,
        'features.evolucionTemporal': true,
        'features.soportePrioritario': true
      }
    };

    const result = await collection.updateMany(filter, update);
    console.log(`updateMany -> matchedCount: ${result.matchedCount}, modifiedCount: ${result.modifiedCount}`);

    // Conteos posteriores
    const totalProsAfter = await collection.countDocuments({ tipoSuscripcion: 'pro' });
    const prosWithFeatureAfter = await collection.countDocuments({ tipoSuscripcion: 'pro', 'features.exportarPDF': true });

    console.log(`Usuarios con tipoSuscripcion='pro' (después): ${totalProsAfter}`);
    console.log(`Usuarios Pro con exportarPDF=true (después): ${prosWithFeatureAfter}`);

    // Mostrar algunos Pro (después) para inspección (limit 10)
    const sampleProsAfter = await collection.find({ tipoSuscripcion: 'pro' }).limit(10).toArray();
    console.log('Ejemplo usuarios Pro (después):', sampleProsAfter);

    await mongoose.disconnect();
    console.log('Migración completada. Desconectado.');
    process.exit(0);
  } catch (err) {
    console.error('Error en migración:', err);
    try { await mongoose.disconnect(); } catch (_) {}
    process.exit(1);
  }
}

run();