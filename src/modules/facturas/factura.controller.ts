import { Request, Response, NextFunction } from 'express';
import { EstadoFactura } from '@prisma/client';
import { sendSuccess, sendCreated } from '../../shared/response';
import { FacturaService } from './factura.service';
import { FacturaRepository } from './factura.repository';
import { generateFacturaPdf } from './factura.pdf';

const service = new FacturaService(new FacturaRepository());

export const facturaController = {
  findAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const miembroId = req.query.miembroId ? Number(req.query.miembroId) : undefined;
      const estado    = req.query.estado as EstadoFactura | undefined;
      const facturas  = await service.findAll({ miembroId, estado });
      sendSuccess(res, facturas);
    } catch (err) {
      next(err);
    }
  },

  findById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const factura = await service.findById(Number(req.params.id));
      sendSuccess(res, factura);
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const factura = await service.create(req.body);
      sendCreated(res, factura, 'Factura emitida correctamente');
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const factura = await service.update(Number(req.params.id), req.body);
      sendSuccess(res, factura, 'Factura actualizada');
    } catch (err) {
      next(err);
    }
  },

  getPdf: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const factura = await service.findById(Number(req.params.id));

      // Convertir Decimals de Prisma a number
      const facturaData = {
        ...factura,
        subtotal: Number(factura.subtotal),
        impuesto: Number(factura.impuesto),
        total: Number(factura.total),
        pago: {
          ...factura.pago,
          miembro: {
            ...factura.pago.miembro,
            planMembresia: {
              ...factura.pago.miembro.planMembresia,
              precio: Number(factura.pago.miembro.planMembresia.precio),
            },
          },
        },
      };

      const buffer = await generateFacturaPdf(facturaData as Parameters<typeof generateFacturaPdf>[0]);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="factura-${factura.numeroFactura}.pdf"`,
      );
      res.setHeader('Content-Length', buffer.length);
      res.end(buffer);
    } catch (err) {
      next(err);
    }
  },
};
