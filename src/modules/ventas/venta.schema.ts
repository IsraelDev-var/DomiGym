import { z } from 'zod';
import { MetodoPago } from '@prisma/client';

// Use z.enum instead of z.nativeEnum for new enums (EstadoVenta, TipoItem)
// because the Prisma client may not have regenerated them yet.

export const itemVentaSchema = z.object({
  tipo: z.enum(['PRODUCTO', 'SERVICIO']),
  inventarioId: z.number().int().positive().optional(),
  nombreItem: z.string().min(1).max(150),
  cantidad: z.number().int().min(1),
  precioUnitario: z.number().positive(),
});

export const createVentaSchema = z.object({
  sucursalId: z.number().int().positive(),
  miembroId: z.number().int().positive().optional(),
  clienteNombre: z.string().max(100).optional(),
  metodoPago: z.nativeEnum(MetodoPago),
  items: z.array(itemVentaSchema).min(1, 'Se requiere al menos un ítem'),
  notas: z.string().optional(),
});

export const updateVentaSchema = z.object({
  estado: z.enum(['COMPLETADA', 'ANULADA', 'DEVUELTA']),
  notas: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const reporteQuerySchema = z.object({
  desde: z.coerce.date(),
  hasta: z.coerce.date(),
  sucursalId: z.coerce.number().int().positive().optional(),
});

export type CreateVentaDto = z.infer<typeof createVentaSchema>;
export type UpdateVentaDto = z.infer<typeof updateVentaSchema>;
export type ItemVentaDto = z.infer<typeof itemVentaSchema>;
