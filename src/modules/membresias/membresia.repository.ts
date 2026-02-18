import { prisma } from '../../lib/prisma';
import type { CreateMembresiaDto, UpdateMembresiaDto } from './membresia.schema';

export class MembresiaRepository {
  findAll(soloActivos = false) {
    return prisma.planMembresia.findMany({
      where: soloActivos ? { estado: true } : undefined,
      orderBy: { precio: 'asc' },
    });
  }

  findById(id: number) {
    return prisma.planMembresia.findUnique({ where: { id } });
  }

  create(data: CreateMembresiaDto) {
    return prisma.planMembresia.create({ data });
  }

  update(id: number, data: UpdateMembresiaDto) {
    return prisma.planMembresia.update({ where: { id }, data });
  }

  delete(id: number) {
    // Soft delete
    return prisma.planMembresia.update({
      where: { id },
      data: { estado: false },
    });
  }
}
