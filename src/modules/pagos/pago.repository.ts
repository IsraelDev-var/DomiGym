import { EstadoPago } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import type { CreatePagoDto, UpdatePagoDto } from './pago.schema';

const includeRelaciones = {
  miembro: {
    include: {
      usuario: { select: { nombre: true, email: true } },
    },
  },
};

export class PagoRepository {
  findAll(filtros?: { miembroId?: number; estado?: EstadoPago }) {
    return prisma.pago.findMany({
      where: filtros,
      include: includeRelaciones,
      orderBy: { fechaPago: 'desc' },
    });
  }

  findById(id: number) {
    return prisma.pago.findUnique({
      where: { id },
      include: includeRelaciones,
    });
  }

  findByMiembro(miembroId: number) {
    return prisma.pago.findMany({
      where: { miembroId },
      orderBy: { fechaPago: 'desc' },
    });
  }

  create(data: CreatePagoDto & { numeroComprobante: string }) {
    return prisma.pago.create({
      data: { ...data, estado: 'COMPLETADO' },
      include: includeRelaciones,
    });
  }

  update(id: number, data: UpdatePagoDto) {
    return prisma.pago.update({ where: { id }, data, include: includeRelaciones });
  }

  // Reporte: ingresos por período
  async totalIngresosPorPeriodo(desde: Date, hasta: Date) {
    const result = await prisma.pago.aggregate({
      where: {
        estado: 'COMPLETADO',
        fechaPago: { gte: desde, lte: hasta },
      },
      _sum: { monto: true },
      _count: true,
    });
    return result;
  }
}
