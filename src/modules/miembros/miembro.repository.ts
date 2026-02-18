import { EstadoMembresia } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import type { CreateMiembroDto, UpdateMiembroDto } from './miembro.schema';

const includeRelaciones = {
  usuario: { select: { id: true, nombre: true, email: true } },
  sucursal: { select: { id: true, nombre: true, ciudad: true } },
  planMembresia: true,
};

export class MiembroRepository {
  findAll(filtros?: { sucursalId?: number; estadoMembresia?: EstadoMembresia }) {
    return prisma.miembro.findMany({
      where: filtros,
      include: includeRelaciones,
      orderBy: { fechaRegistro: 'desc' },
    });
  }

  findById(id: number) {
    return prisma.miembro.findUnique({
      where: { id },
      include: {
        ...includeRelaciones,
        pagos: { orderBy: { fechaPago: 'desc' }, take: 5 },
        accesos: { orderBy: { fechaHoraAcceso: 'desc' }, take: 5 },
      },
    });
  }

  findByUsuarioId(usuarioId: number) {
    return prisma.miembro.findUnique({
      where: { usuarioId },
      include: includeRelaciones,
    });
  }

  create(data: CreateMiembroDto) {
    return prisma.miembro.create({
      data,
      include: includeRelaciones,
    });
  }

  update(id: number, data: UpdateMiembroDto) {
    return prisma.miembro.update({
      where: { id },
      data,
      include: includeRelaciones,
    });
  }

  // Verifica si la membresía está activa y no vencida
  async verificarAcceso(miembroId: number): Promise<boolean> {
    const miembro = await prisma.miembro.findUnique({
      where: { id: miembroId },
      select: { estadoMembresia: true, fechaFin: true },
    });

    if (!miembro || miembro.estadoMembresia !== 'ACTIVA') return false;
    return miembro.fechaFin >= new Date();
  }
}
