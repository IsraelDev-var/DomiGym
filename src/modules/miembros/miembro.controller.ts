import { Request, Response, NextFunction } from 'express';
import { MiembroService } from './miembro.service';
import { sendSuccess, sendCreated } from '../../shared/response';
import { EstadoMembresia } from '@prisma/client';

export class MiembroController {
  constructor(private readonly service: MiembroService) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sucursalId, estadoMembresia } = req.query;
      const filtros = {
        ...(sucursalId && { sucursalId: Number(sucursalId) }),
        ...(estadoMembresia && { estadoMembresia: estadoMembresia as EstadoMembresia }),
      };
      const data = await this.service.findAll(Object.keys(filtros).length ? filtros : undefined);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.findById(Number(req.params.id));
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.create(req.body);
      sendCreated(res, data, 'Miembro registrado exitosamente');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);
      sendSuccess(res, data, 'Miembro actualizado');
    } catch (err) {
      next(err);
    }
  };

  renovar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { planMembresiaId, fechaFin } = req.body;
      const data = await this.service.renovar(Number(req.params.id), planMembresiaId, new Date(fechaFin));
      sendSuccess(res, data, 'Membresía renovada exitosamente');
    } catch (err) {
      next(err);
    }
  };

  verificarAcceso = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.verificarAcceso(Number(req.params.id));
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  };
}
