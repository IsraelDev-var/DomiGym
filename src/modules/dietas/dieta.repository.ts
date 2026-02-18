import { prisma } from '../../lib/prisma';

export class DietaRepository {
  findAll(miembroId?: number) {
    return prisma.planDieta.findMany({
      where: miembroId ? { miembroId } : undefined,
      include: {
        comidas: { orderBy: { tipo: 'asc' } },
        miembro: { select: { id: true, usuario: { select: { nombre: true } } } },
      },
      orderBy: { creadoEn: 'desc' },
    });
  }

  findById(id: number) {
    return prisma.planDieta.findUnique({
      where: { id },
      include: { comidas: { orderBy: { tipo: 'asc' } } },
    });
  }

  findActivoByMiembro(miembroId: number) {
    return prisma.planDieta.findFirst({
      where: { miembroId, activo: true },
      include: { comidas: { orderBy: { tipo: 'asc' } } },
    });
  }

  create(data: { miembroId: number; nombre: string; objetivo: string; caloriasObj?: number }) {
    return prisma.planDieta.create({ data, include: { comidas: true } });
  }

  update(id: number, data: Partial<{ nombre: string; objetivo: string; caloriasObj: number; activo: boolean }>) {
    return prisma.planDieta.update({ where: { id }, data, include: { comidas: true } });
  }

  delete(id: number) {
    return prisma.planDieta.delete({ where: { id } });
  }

  addComida(planDietaId: number, data: { tipo: string; descripcion: string; calorias?: number; proteinas?: number; carbos?: number; grasas?: number }) {
    return prisma.comidaDieta.create({ data: { planDietaId, ...data } });
  }

  deleteComida(id: number) {
    return prisma.comidaDieta.delete({ where: { id } });
  }
}
