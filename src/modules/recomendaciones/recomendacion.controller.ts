import { Request, Response, NextFunction } from 'express';
import { RecomendacionService } from './recomendacion.service';
import { sendSuccess, sendCreated } from '../../shared/response';

export class RecomendacionController {
  constructor(private readonly service: RecomendacionService) {}

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
      sendCreated(res, data, 'Recomendación creada exitosamente');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);
      sendSuccess(res, data, 'Recomendación actualizada');
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.delete(Number(req.params.id));
      sendSuccess(res, null, 'Recomendación eliminada');
    } catch (err) {
      next(err);
    }
  };
}
