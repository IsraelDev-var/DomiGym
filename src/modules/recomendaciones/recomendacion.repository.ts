import { prisma } from '../../lib/prisma';

export class RecomendacionRepository {
  findAll(miembroId?: number) {
    return prisma.recomendacionSalud.findMany({
      where: miembroId ? { miembroId } : undefined,
      include: {
        miembro: { select: { id: true, usuario: { select: { nombre: true } } } },
      },
      orderBy: { creadoEn: 'desc' },
    });
  }

  findById(id: number) {
    return prisma.recomendacionSalud.findUnique({ where: { id } });
  }

  findActivasByMiembro(miembroId: number) {
    return prisma.recomendacionSalud.findMany({
      where: { miembroId, activa: true },
      orderBy: [{ categoria: 'asc' }, { creadoEn: 'desc' }],
    });
  }

  create(data: { miembroId: number; titulo: string; descripcion: string; categoria: string }) {
    return prisma.recomendacionSalud.create({ data });
  }

  update(id: number, data: Partial<{ titulo: string; descripcion: string; categoria: string; activa: boolean }>) {
    return prisma.recomendacionSalud.update({ where: { id }, data });
  }

  delete(id: number) {
    return prisma.recomendacionSalud.delete({ where: { id } });
  }
}
