import { env } from './config/env';
import app from './app';
import { prisma } from './lib/prisma';

async function bootstrap() {
  try {
    // Verifica conexión a la BD antes de arrancar
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    app.listen(env.PORT, () => {
      console.log(`🚀 DomiGym API corriendo en http://localhost:${env.PORT}`);
      console.log(`📖 Entorno: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Cierre limpio
process.on('SIGTERM', async () => {
  console.log('🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
