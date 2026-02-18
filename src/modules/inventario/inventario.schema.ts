import { z } from 'zod';

export const createInventarioSchema = z.object({
  sucursalId: z.number().int().positive(),
  nombreProducto: z.string().min(2).max(100),
  categoria: z.string().min(2).max(100),
  cantidad: z.number().int().min(0),
  precioUnitario: z.number().positive(),
  fechaIngreso: z.coerce.date().optional(),
  estado: z.string().default('Disponible'),
});

export const updateInventarioSchema = createInventarioSchema.partial().omit({ sucursalId: true });

export const ajustarStockSchema = z.object({
  cantidad: z.number().int(),
  operacion: z.enum(['agregar', 'restar']),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateInventarioDto = z.infer<typeof createInventarioSchema>;
export type UpdateInventarioDto = z.infer<typeof updateInventarioSchema>;
export type AjustarStockDto = z.infer<typeof ajustarStockSchema>;
