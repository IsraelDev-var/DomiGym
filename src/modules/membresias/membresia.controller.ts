import { Request, Response, NextFunction } from 'express';
import { MembresiaService } from './membresia.service';
import { sendSuccess, sendCreated } from '../../shared/response';

export class MembresiaController {
  constructor(private readonly service: MembresiaService) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const soloActivos = req.query.activos === 'true';
      const data = await this.service.findAll(soloActivos);
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
      sendCreated(res, data, 'Plan de membresía creado');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);
      sendSuccess(res, data, 'Plan de membresía actualizado');
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.delete(Number(req.params.id));
      sendSuccess(res, data, 'Plan de membresía desactivado');
    } catch (err) {
      next(err);
    }
  };
}
