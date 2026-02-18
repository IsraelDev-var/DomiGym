import { Request, Response, NextFunction } from 'express';
import { InventarioService } from './inventario.service';
import { sendSuccess, sendCreated } from '../../shared/response';

export class InventarioController {
  constructor(private readonly service: InventarioService) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sucursalId, categoria } = req.query;
      const filtros = {
        ...(sucursalId && { sucursalId: Number(sucursalId) }),
        ...(categoria && { categoria: String(categoria) }),
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
      sendCreated(res, data, 'Item de inventario creado');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);
      sendSuccess(res, data, 'Item actualizado');
    } catch (err) {
      next(err);
    }
  };

  ajustarStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.ajustarStock(Number(req.params.id), req.body);
      sendSuccess(res, data, 'Stock ajustado exitosamente');
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.delete(Number(req.params.id));
      sendSuccess(res, null, 'Item eliminado');
    } catch (err) {
      next(err);
    }
  };
}
