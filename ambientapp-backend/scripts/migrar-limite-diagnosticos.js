// Script para migrar el límite de diagnósticos de usuarios Free de 4 a 3
// Ejecutar con: node scripts/migrar-limite-diagnosticos.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function migrarLimiteDiagnosticos() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI no está definida en el archivo .env');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    console.log('\n🔍 Buscando usuarios Free con límite de 4 diagnósticos...');

    // Buscar usuarios Free que tengan límite de 4
    const usuariosActualizar = await User.find({
      tipoSuscripcion: 'free',
      'limites.diagnosticosMes': 4
    });

    console.log(`📊 Encontrados ${usuariosActualizar.length} usuarios para actualizar`);

    if (usuariosActualizar.length === 0) {
      console.log('✨ No hay usuarios que actualizar');
      await mongoose.connection.close();
      return;
    }

    // Mostrar usuarios que se van a actualizar
    console.log('\n📋 Usuarios a actualizar:');
    usuariosActualizar.forEach(u => {
      console.log(`  - ${u.email} (${u.nombre}) - Límite actual: ${u.limites.diagnosticosMes}`);
    });

    console.log('\n🔧 Actualizando usuarios...');

    // Actualizar en lote
    const resultado = await User.updateMany(
      {
        tipoSuscripcion: 'free',
        'limites.diagnosticosMes': 4
      },
      {
        $set: {
          'limites.diagnosticosMes': 3
        }
      }
    );

    console.log(`\n✅ Migración completada`);
    console.log(`   - Documentos encontrados: ${resultado.matchedCount}`);
    console.log(`   - Documentos actualizados: ${resultado.modifiedCount}`);

    // Verificar la actualización
    console.log('\n🔍 Verificando actualización...');
    const usuariosVerificar = await User.find({
      tipoSuscripcion: 'free',
      'limites.diagnosticosMes': 3
    }).select('email nombre limites.diagnosticosMes');

    console.log(`📊 Usuarios Free con límite de 3 diagnósticos: ${usuariosVerificar.length}`);

    if (usuariosVerificar.length > 0) {
      console.log('\n✅ Ejemplos de usuarios actualizados:');
      usuariosVerificar.slice(0, 5).forEach(u => {
        console.log(`  - ${u.email} - Límite: ${u.limites.diagnosticosMes}`);
      });
    }

    // Verificar que no queden usuarios con límite de 4
    const usuariosRestantes = await User.countDocuments({
      tipoSuscripcion: 'free',
      'limites.diagnosticosMes': 4
    });

    if (usuariosRestantes > 0) {
      console.log(`\n⚠️  ADVERTENCIA: Aún quedan ${usuariosRestantes} usuarios con límite de 4`);
    } else {
      console.log('\n✅ Todos los usuarios Free ahora tienen límite de 3 diagnósticos');
    }

    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
    console.log('🎉 Migración finalizada con éxito\n');

  } catch (error) {
    console.error('❌ Error en la migración:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Ejecutar migración
migrarLimiteDiagnosticos();
