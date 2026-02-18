import { Request, Response, NextFunction } from 'express';
import { PagoService } from './pago.service';
import { sendSuccess, sendCreated } from '../../shared/response';
import { EstadoPago } from '@prisma/client';

export class PagoController {
  constructor(private readonly service: PagoService) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { miembroId, estado } = req.query;
      const filtros = {
        ...(miembroId && { miembroId: Number(miembroId) }),
        ...(estado && { estado: estado as EstadoPago }),
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
      sendCreated(res, data, 'Pago registrado exitosamente');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);
      sendSuccess(res, data, 'Pago actualizado');
    } catch (err) {
      next(err);
    }
  };

  reporte = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { desde, hasta } = req.query;
      const data = await this.service.reporteIngresos(
        new Date(desde as string),
        new Date(hasta as string),
      );
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  };
}
