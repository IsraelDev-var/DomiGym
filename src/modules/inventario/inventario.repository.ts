import { prisma } from '../../lib/prisma';
import type { CreateInventarioDto, UpdateInventarioDto } from './inventario.schema';

export class InventarioRepository {
  findAll(filtros?: { sucursalId?: number; categoria?: string }) {
    return prisma.inventario.findMany({
      where: filtros,
      include: { sucursal: { select: { nombre: true } } },
      orderBy: { nombreProducto: 'asc' },
    });
  }

  findById(id: number) {
    return prisma.inventario.findUnique({
      where: { id },
      include: { sucursal: { select: { nombre: true } } },
    });
  }

  create(data: CreateInventarioDto) {
    return prisma.inventario.create({ data });
  }

  update(id: number, data: UpdateInventarioDto) {
    return prisma.inventario.update({ where: { id }, data });
  }

  ajustarStock(id: number, delta: number) {
    return prisma.inventario.update({
      where: { id },
      data: { cantidad: { increment: delta } },
    });
  }

  delete(id: number) {
    return prisma.inventario.delete({ where: { id } });
  }
}
