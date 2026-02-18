import { Request, Response, NextFunction } from 'express';
import { AccesoService } from './acceso.service';
import { sendSuccess, sendCreated } from '../../shared/response';

export class AccesoController {
  constructor(private readonly service: AccesoService) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { miembroId, sucursalId } = req.query;
      const filtros = {
        ...(miembroId && { miembroId: Number(miembroId) }),
        ...(sucursalId && { sucursalId: Number(sucursalId) }),
      };
      const data = await this.service.findAll(Object.keys(filtros).length ? filtros : undefined);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  };

  findByMiembro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.findByMiembro(Number(req.params.miembroId));
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  };

  registrar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.registrar(req.body);
      sendCreated(res, data, 'Acceso registrado');
    } catch (err) {
      next(err);
    }
  };
}
