import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding base de datos...');

  // Sucursal principal
  const sucursal = await prisma.sucursal.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nombre: 'DomiGym Centro',
      direccion: 'Av. Principal 123',
      ciudad: 'Ciudad de México',
      telefono: '+52-555-1234',
      horarioApertura: '06:00',
      horarioCierre: '22:00',
    },
  });

  // Admin por defecto
  const adminHash = await bcrypt.hash('Admin1234!', 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@domigym.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@domigym.com',
      contrasena: adminHash,
      rol: 'ADMIN',
    },
  });

  // Gerente por defecto
  const gerenteHash = await bcrypt.hash('Gerente1234!', 10);
  await prisma.usuario.upsert({
    where: { email: 'gerente@domigym.com' },
    update: {},
    create: {
      nombre: 'Gerente General',
      email: 'gerente@domigym.com',
      contrasena: gerenteHash,
      rol: 'GERENTE',
    },
  });
  // Cliente de prueba
  const clienteHash = await bcrypt.hash('cliente1234!', 10);
  await prisma.usuario.upsert({
    where: { email: 'cliente@domigym.com' },
    update: {},
    create: {
      nombre: 'Cliente Demo',
      email: 'cliente@domigym.com',
      contrasena: clienteHash,
      rol: 'CLIENTE',
    },
  });

  // Planes de membresía
  await prisma.planMembresia.createMany({
    skipDuplicates: true,
    data: [
      { nombre: 'Mensual', duracionDias: 30, precio: 30.00, descripcion: 'Plan mensual básico' },
      { nombre: 'Trimestral', duracionDias: 90, precio: 80.00, descripcion: 'Ahorra un 11% vs mensual' },
      { nombre: 'Anual', duracionDias: 365, precio: 300.00, descripcion: 'El mejor precio, ahorra 17%' },
    ],
  });

  // Miembro para el cliente demo
  const planMensual = await prisma.planMembresia.findFirst({ where: { nombre: 'Mensual' } });
  const clienteUser = await prisma.usuario.findUnique({ where: { email: 'cliente@domigym.com' } });

  if (clienteUser && planMensual) {
    const hoy = new Date();
    const fin = new Date(hoy);
    fin.setDate(fin.getDate() + 30);

    await prisma.miembro.upsert({
      where: { usuarioId: clienteUser.id },
      update: {},
      create: {
        usuarioId: clienteUser.id,
        sucursalId: sucursal.id,
        planMembresiaId: planMensual.id,
        estadoMembresia: 'ACTIVA',
        fechaInicio: hoy,
        fechaFin: fin,
      },
    });
  }

  console.log('✅ Seed completado');
  console.log(`   Sucursal: ${sucursal.nombre}`);
  console.log('   Admin:   admin@domigym.com   / Admin1234!');
  console.log('   Gerente: gerente@domigym.com / Gerente1234!');
  console.log('   Cliente: cliente@domigym.com / cliente1234! (con Miembro vinculado)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
