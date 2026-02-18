import { Request, Response, NextFunction } from 'express';
import { SucursalService } from './sucursal.service';
import { sendSuccess, sendCreated } from '../../shared/response';

export class SucursalController {
  constructor(private readonly service: SucursalService) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const soloActivas = req.query.activas === 'true';
      const data = await this.service.findAll(soloActivas);
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
      sendCreated(res, data, 'Sucursal creada exitosamente');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);
      sendSuccess(res, data, 'Sucursal actualizada');
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.delete(Number(req.params.id));
      sendSuccess(res, data, 'Sucursal desactivada');
    } catch (err) {
      next(err);
    }
  };
}
