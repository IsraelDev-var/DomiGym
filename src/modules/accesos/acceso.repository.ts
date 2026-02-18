import { prisma } from '../../lib/prisma';
import type { RegistrarAccesoDto } from './acceso.schema';

export class AccesoRepository {
  findAll(filtros?: { miembroId?: number; sucursalId?: number }) {
    return prisma.acceso.findMany({
      where: filtros,
      include: {
        miembro: {
          include: { usuario: { select: { nombre: true, email: true } } },
        },
        sucursal: { select: { id: true, nombre: true } },
      },
      orderBy: { fechaHoraAcceso: 'desc' },
    });
  }

  findByMiembro(miembroId: number, limite = 20) {
    return prisma.acceso.findMany({
      where: { miembroId },
      include: { sucursal: { select: { nombre: true } } },
      orderBy: { fechaHoraAcceso: 'desc' },
      take: limite,
    });
  }

  registrar(data: RegistrarAccesoDto & { estado: 'PERMITIDO' | 'DENEGADO' }) {
    return prisma.acceso.create({
      data,
      include: {
        miembro: {
          include: { usuario: { select: { nombre: true } } },
        },
        sucursal: { select: { nombre: true } },
      },
    });
  }
}
