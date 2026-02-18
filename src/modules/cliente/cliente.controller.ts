import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess } from '../../shared/response';
import { NotFoundError } from '../../shared/errors';

async function getMiembroId(userId: number): Promise<number> {
  const miembro = await prisma.miembro.findUnique({
    where: { usuarioId: userId },
    select: { id: true },
  });
  if (!miembro) throw new NotFoundError('Miembro asociado al usuario');
  return miembro.id;
}

export const clienteController = {
  perfil: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const miembroId = await getMiembroId(req.user!.userId);
      const miembro = await prisma.miembro.findUnique({
        where: { id: miembroId },
        include: {
          usuario: { select: { id: true, nombre: true, email: true } },
          sucursal: { select: { id: true, nombre: true, ciudad: true } },
          planMembresia: true,
          pagos: { orderBy: { fechaPago: 'desc' }, take: 5 },
          accesos: { orderBy: { fechaHoraAcceso: 'desc' }, take: 5 },
        },
      });
      sendSuccess(res, miembro);
    } catch (err) {
      next(err);
    }
  },

  pagos: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const miembroId = await getMiembroId(req.user!.userId);
      const data = await prisma.pago.findMany({
        where: { miembroId },
        orderBy: { fechaPago: 'desc' },
      });
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  accesos: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const miembroId = await getMiembroId(req.user!.userId);
      const data = await prisma.acceso.findMany({
        where: { miembroId },
        include: { sucursal: { select: { nombre: true } } },
        orderBy: { fechaHoraAcceso: 'desc' },
        take: 50,
      });
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  rutina: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const miembroId = await getMiembroId(req.user!.userId);
      const data = await prisma.rutina.findFirst({
        where: { miembroId, activa: true },
        include: { ejercicios: { orderBy: { dia: 'asc' } } },
      });
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  dieta: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const miembroId = await getMiembroId(req.user!.userId);
      const data = await prisma.planDieta.findFirst({
        where: { miembroId, activo: true },
        include: { comidas: { orderBy: { tipo: 'asc' } } },
      });
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  recomendaciones: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const miembroId = await getMiembroId(req.user!.userId);
      const data = await prisma.recomendacionSalud.findMany({
        where: { miembroId, activa: true },
        orderBy: [{ categoria: 'asc' }, { creadoEn: 'desc' }],
      });
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },
};
