import { Request, Response, NextFunction } from 'express';
import { RutinaService } from './rutina.service';
import { sendSuccess, sendCreated } from '../../shared/response';

export class RutinaController {
  constructor(private readonly service: RutinaService) {}

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
      sendCreated(res, data, 'Rutina creada exitosamente');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);
      sendSuccess(res, data, 'Rutina actualizada');
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.delete(Number(req.params.id));
      sendSuccess(res, null, 'Rutina eliminada');
    } catch (err) {
      next(err);
    }
  };

  addEjercicio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.addEjercicio(Number(req.params.id), req.body);
      sendCreated(res, data, 'Ejercicio agregado');
    } catch (err) {
      next(err);
    }
  };

  deleteEjercicio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deleteEjercicio(Number(req.params.id), Number(req.params.ejercicioId));
      sendSuccess(res, null, 'Ejercicio eliminado');
    } catch (err) {
      next(err);
    }
  };
}
