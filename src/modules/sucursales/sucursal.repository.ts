import { prisma } from '../../lib/prisma';
import type { CreateSucursalDto, UpdateSucursalDto } from './sucursal.schema';

export class SucursalRepository {
  findAll(soloActivas = false) {
    return prisma.sucursal.findMany({
      where: soloActivas ? { estado: true } : undefined,
      include: {
        gerente: { select: { id: true, nombre: true, email: true } },
        _count: { select: { miembros: true } },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  findById(id: number) {
    return prisma.sucursal.findUnique({
      where: { id },
      include: {
        gerente: { select: { id: true, nombre: true, email: true } },
        _count: { select: { miembros: true, inventario: true } },
      },
    });
  }

  create(data: CreateSucursalDto) {
    return prisma.sucursal.create({ data });
  }

  update(id: number, data: UpdateSucursalDto) {
    return prisma.sucursal.update({ where: { id }, data });
  }

  delete(id: number) {
    return prisma.sucursal.update({ where: { id }, data: { estado: false } });
  }
}
