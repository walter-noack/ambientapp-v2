// Script para resetear planInfo de todos los usuarios
// Esto fuerza que el virtual 'planInfo' se recalcule con los nuevos límites
// Ejecutar con: node scripts/resetear-planinfo.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function resetearPlanInfo() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI no está definida en el archivo .env');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    console.log('\n🔍 Buscando usuarios Free...');

    // Buscar todos los usuarios Free
    const usuariosFree = await User.find({
      tipoSuscripcion: 'free'
    });

    console.log(`📊 Encontrados ${usuariosFree.length} usuarios Free`);

    if (usuariosFree.length === 0) {
      console.log('✨ No hay usuarios Free');
      await mongoose.connection.close();
      return;
    }

    console.log('\n🔧 Procesando usuarios...');

    let actualizados = 0;

    for (const usuario of usuariosFree) {
      // Verificar y resetear límites si es necesario
      if (typeof usuario.verificarYResetearLimites === 'function') {
        usuario.verificarYResetearLimites();
      }

      // Asegurar que tiene el límite correcto
      if (usuario.limites.diagnosticosMes !== 3) {
        console.log(`  ⚠️  ${usuario.email} tenía límite de ${usuario.limites.diagnosticosMes}, actualizando a 3`);
        usuario.limites.diagnosticosMes = 3;
      }

      // Si diagnosticosRealizados excede el nuevo límite, ajustarlo
      if (usuario.limites.diagnosticosRealizados > 3) {
        console.log(`  ⚠️  ${usuario.email} tenía ${usuario.limites.diagnosticosRealizados} diagnósticos usados, ajustando a 3`);
        usuario.limites.diagnosticosRealizados = 3;
      }

      await usuario.save();
      actualizados++;

      // Mostrar info del usuario
      const planInfo = usuario.planInfo;
      console.log(`  ✅ ${usuario.email}:`);
      console.log(`      - Límite: ${usuario.limites.diagnosticosMes}`);
      console.log(`      - Realizados: ${usuario.limites.diagnosticosRealizados}`);
      console.log(`      - PlanInfo totales: ${planInfo.diagnosticosTotales}`);
      console.log(`      - PlanInfo restantes: ${planInfo.diagnosticosRestantes}`);
    }

    console.log(`\n✅ Procesados ${actualizados} usuarios`);

    // Verificación final
    console.log('\n🔍 Verificación final...');
    const usuariosConLimite4 = await User.countDocuments({
      tipoSuscripcion: 'free',
      'limites.diagnosticosMes': { $ne: 3 }
    });

    if (usuariosConLimite4 > 0) {
      console.log(`\n⚠️  ADVERTENCIA: Hay ${usuariosConLimite4} usuarios Free sin límite de 3`);
    } else {
      console.log('\n✅ Todos los usuarios Free tienen límite de 3 diagnósticos');
    }

    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
    console.log('🎉 Proceso finalizado con éxito\n');

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Ejecutar
resetearPlanInfo();
