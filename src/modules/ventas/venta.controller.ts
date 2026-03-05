import { Request, Response, NextFunction } from 'express';
import { EstadoVenta } from '@prisma/client';
import { VentaService } from './venta.service';
import { sendSuccess, sendCreated } from '../../shared/response';
import { generateVentaPdf } from './venta.pdf';

export class VentaController {
  constructor(private readonly service: VentaService) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sucursalId, estado, desde, hasta } = req.query;
      const filtros = {
        ...(sucursalId && { sucursalId: Number(sucursalId) }),
        ...(estado && { estado: estado as EstadoVenta }),
        ...(desde && { desde: new Date(desde as string) }),
        ...(hasta && { hasta: new Date(hasta as string) }),
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
      sendCreated(res, data, 'Venta registrada exitosamente');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);
      sendSuccess(res, data, 'Venta actualizada');
    } catch (err) {
      next(err);
    }
  };

  reporte = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { desde, hasta, sucursalId } = req.query;
      const data = await this.service.reporte(
        new Date(desde as string),
        new Date(hasta as string),
        sucursalId ? Number(sucursalId) : undefined
      );
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  };

  getPdf = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const venta = await this.service.findById(Number(req.params.id));
      const buffer = await generateVentaPdf(venta as any);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="venta-${venta.numeroVenta}.pdf"`
      );
      res.send(buffer);
    } catch (err) {
      next(err);
    }
  };
}
