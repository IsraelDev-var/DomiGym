import { prisma } from '../../lib/prisma';

const includeRelaciones = {
  sucursal: { select: { id: true, nombre: true } },
  miembro: {
    select: {
      id: true,
      usuario: { select: { nombre: true, email: true } },
    },
  },
  items: {
    include: {
      inventario: { select: { id: true, nombreProducto: true, categoria: true } },
    },
  },
} as const;

export class VentaRepository {
  findAll(filtros?: { sucursalId?: number; estado?: string; desde?: Date; hasta?: Date }) {
    return prisma.venta.findMany({
      where: {
        ...(filtros?.sucursalId && { sucursalId: filtros.sucursalId }),
        ...(filtros?.estado && { estado: filtros.estado }),
        ...(filtros?.desde || filtros?.hasta
          ? {
              fechaVenta: {
                ...(filtros.desde && { gte: filtros.desde }),
                ...(filtros.hasta && { lte: filtros.hasta }),
              },
            }
          : {}),
      },
      include: includeRelaciones,
      orderBy: { fechaVenta: 'desc' },
    });
  }

  findById(id: number) {
    return prisma.venta.findUnique({
      where: { id },
      include: includeRelaciones,
    });
  }

  async countTotal() {
    return prisma.venta.count();
  }

  async create(
    ventaData: {
      sucursalId: number;
      miembroId?: number;
      clienteNombre?: string;
      numeroVenta: string;
      subtotal: number;
      impuesto: number;
      total: number;
      metodoPago: string;
      notas?: string;
    },
    itemsData: {
      tipo: string;
      inventarioId?: number;
      nombreItem: string;
      cantidad: number;
      precioUnitario: number;
      subtotal: number;
    }[]
  ) {
    return prisma.$transaction(async (tx) => {
      const venta = await tx.venta.create({
        data: {
          sucursalId: ventaData.sucursalId,
          miembroId: ventaData.miembroId,
          clienteNombre: ventaData.clienteNombre,
          numeroVenta: ventaData.numeroVenta,
          subtotal: ventaData.subtotal,
          impuesto: ventaData.impuesto,
          total: ventaData.total,
          metodoPago: ventaData.metodoPago as any,
          notas: ventaData.notas,
        },
      });

      for (const item of itemsData) {
        await tx.itemVenta.create({
          data: {
            ventaId: venta.id,
            tipo: item.tipo as any,
            inventarioId: item.inventarioId,
            nombreItem: item.nombreItem,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.subtotal,
          },
        });

        if (item.tipo === 'PRODUCTO' && item.inventarioId) {
          await tx.inventario.update({
            where: { id: item.inventarioId },
            data: { cantidad: { decrement: item.cantidad } },
          });
        }
      }

      return tx.venta.findUnique({
        where: { id: venta.id },
        include: includeRelaciones,
      });
    });
  }

  async update(id: number, data: { estado?: EstadoVenta; notas?: string }) {
    return prisma.venta.update({
      where: { id },
      data,
      include: includeRelaciones,
    });
  }

  async restoreStock(ventaId: number) {
    const items = await prisma.itemVenta.findMany({
      where: { ventaId, tipo: 'PRODUCTO', inventarioId: { not: null } },
    });
    for (const item of items) {
      await prisma.inventario.update({
        where: { id: item.inventarioId! },
        data: { cantidad: { increment: item.cantidad } },
      });
    }
  }

  async reporteVentas(desde: Date, hasta: Date, sucursalId?: number) {
    const where = {
      fechaVenta: { gte: desde, lte: hasta },
      ...(sucursalId && { sucursalId }),
    };

    const [aggregate, porEstado] = await Promise.all([
      prisma.venta.aggregate({
        where,
        _sum: { total: true },
        _count: { id: true },
      }),
      prisma.venta.groupBy({
        by: ['estado'],
        where,
        _count: { id: true },
        _sum: { total: true },
      }),
    ]);

    return { aggregate, porEstado };
  }
}
