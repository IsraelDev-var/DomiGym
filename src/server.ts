import { env } from './config/env';
import app from './app';
import { prisma } from './lib/prisma';
import { logger } from './config/logger';

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('Conectado a la base de datos');

    app.listen(env.PORT, () => {
      logger.info(`DomiGym API corriendo en http://localhost:${env.PORT}`, { env: env.NODE_ENV });
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor', { error });
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Cierre limpio
process.on('SIGTERM', async () => {
  logger.info('Cerrando servidor (SIGTERM)');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Cerrando servidor (SIGINT)');
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
