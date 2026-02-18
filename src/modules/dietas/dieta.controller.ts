import { Request, Response, NextFunction } from 'express';
import { DietaService } from './dieta.service';
import { sendSuccess, sendCreated } from '../../shared/response';

export class DietaController {
  constructor(private readonly service: DietaService) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const miembroId = req.query.miembroId ? Number(req.query.miembroId) : undefined;
      const data = await this.service.findAll(miembroId);
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
      sendCreated(res, data, 'Plan de dieta creado exitosamente');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);
      sendSuccess(res, data, 'Plan de dieta actualizado');
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.delete(Number(req.params.id));
      sendSuccess(res, null, 'Plan de dieta eliminado');
    } catch (err) {
      next(err);
    }
  };

  addComida = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.addComida(Number(req.params.id), req.body);
      sendCreated(res, data, 'Comida agregada');
    } catch (err) {
      next(err);
    }
  };

  deleteComida = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deleteComida(Number(req.params.id), Number(req.params.comidaId));
      sendSuccess(res, null, 'Comida eliminada');
    } catch (err) {
      next(err);
    }
  };
}
