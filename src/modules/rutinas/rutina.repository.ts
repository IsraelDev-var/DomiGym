import { prisma } from '../../lib/prisma';

export class RutinaRepository {
  findAll(miembroId?: number) {
    return prisma.rutina.findMany({
      where: miembroId ? { miembroId } : undefined,
      include: {
        ejercicios: { orderBy: { dia: 'asc' } },
        miembro: { select: { id: true, usuario: { select: { nombre: true } } } },
      },
      orderBy: { creadoEn: 'desc' },
    });
  }

  findById(id: number) {
    return prisma.rutina.findUnique({
      where: { id },
      include: { ejercicios: { orderBy: { dia: 'asc' } } },
    });
  }

  findActivaByMiembro(miembroId: number) {
    return prisma.rutina.findFirst({
      where: { miembroId, activa: true },
      include: { ejercicios: { orderBy: { dia: 'asc' } } },
    });
  }

  create(data: {
    miembroId: number;
    nombre: string;
    descripcion?: string;
    diasSemana: number;
    objetivo: string;
  }) {
    return prisma.rutina.create({ data, include: { ejercicios: true } });
  }

  update(id: number, data: Partial<{ nombre: string; descripcion: string; diasSemana: number; objetivo: string; activa: boolean }>) {
    return prisma.rutina.update({ where: { id }, data, include: { ejercicios: true } });
  }

  delete(id: number) {
    return prisma.rutina.delete({ where: { id } });
  }

  addEjercicio(rutinaId: number, data: { nombre: string; dia: string; series: number; repeticiones: number; descanso: number; notas?: string }) {
    return prisma.ejercicioRutina.create({ data: { rutinaId, ...data } });
  }

  deleteEjercicio(id: number) {
    return prisma.ejercicioRutina.delete({ where: { id } });
  }
}
