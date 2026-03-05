import { z } from 'zod';
import { EstadoFactura } from '@prisma/client';

export const createFacturaSchema = z.object({
  pagoId: z.number().int().positive(),
  notas: z.string().optional(),
});

export const updateFacturaSchema = z.object({
  estado: z.nativeEnum(EstadoFactura).optional(),
  notas: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateFacturaDto = z.infer<typeof createFacturaSchema>;
export type UpdateFacturaDto = z.infer<typeof updateFacturaSchema>;
