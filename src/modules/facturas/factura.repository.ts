import { EstadoFactura } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import type { UpdateFacturaDto } from './factura.schema';

const includeRelaciones = {
  pago: {
    include: {
      miembro: {
        include: {
          usuario: { select: { id: true, nombre: true, email: true } },
          sucursal: { select: { id: true, nombre: true, ciudad: true, direccion: true, telefono: true } },
          planMembresia: { select: { id: true, nombre: true, precio: true, duracionDias: true } },
        },
      },
    },
  },
};

export class FacturaRepository {
  findAll(filtros?: { miembroId?: number; estado?: EstadoFactura }) {
    return prisma.factura.findMany({
      where: filtros,
      include: includeRelaciones,
      orderBy: { fechaEmision: 'desc' },
    });
  }

  findById(id: number) {
    return prisma.factura.findUnique({
      where: { id },
      include: includeRelaciones,
    });
  }

  findByMiembro(miembroId: number) {
    return prisma.factura.findMany({
      where: { miembroId },
      include: includeRelaciones,
      orderBy: { fechaEmision: 'desc' },
    });
  }

  findByPago(pagoId: number) {
    return prisma.factura.findUnique({ where: { pagoId } });
  }

  async countTotal() {
    return prisma.factura.count();
  }

  create(data: {
    pagoId: number;
    miembroId: number;
    numeroFactura: string;
    subtotal: number;
    impuesto: number;
    total: number;
    notas?: string;
  }) {
    return prisma.factura.create({
      data,
      include: includeRelaciones,
    });
  }

  update(id: number, data: UpdateFacturaDto) {
    return prisma.factura.update({
      where: { id },
      data,
      include: includeRelaciones,
    });
  }
}
