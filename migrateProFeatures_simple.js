// migrateProFeatures_simple.js
const mongoose = require('mongoose');

const MONGO = 'mongodb+srv://wnoack_db_user:9ThOaZEQbWaQXFYU@clusterambientappv2.rgcjwib.mongodb.net/test?retryWrites=true&w=majority';

async function run() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGO);

    const db = mongoose.connection.db;

    // Listar colecciones en la base de datos 'test'
    const cols = await db.listCollections().toArray();
    console.log('Colecciones en la DB test:', cols.map(c => c.name));

    // Cambia 'users' por el nombre que veas en la lista si es distinto
    const collectionName = 'users';
    const collection = db.collection(collectionName);

    // Mostrar algunos documentos de ejemplo
    const sampleUsers = await collection.find({}).limit(3).toArray();
    console.log(`Ejemplo documentos en la colección '${collectionName}':`, sampleUsers);

    await mongoose.disconnect();
    console.log('Desconectado.');
    process.exit(0);
  } catch (err) {
    console.error('Error en migración:', err);
    try { await mongoose.disconnect(); } catch (_) {}
    process.exit(1);
  }
}

run();