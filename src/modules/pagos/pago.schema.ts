import { z } from 'zod';
import { MetodoPago, EstadoPago } from '@prisma/client';

export const createPagoSchema = z.object({
  miembroId: z.number().int().positive(),
  monto: z.number().positive('El monto debe ser positivo'),
  metodoPago: z.nativeEnum(MetodoPago),
  notas: z.string().optional(),
});

export const updatePagoSchema = z.object({
  estado: z.nativeEnum(EstadoPago),
  notas: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreatePagoDto = z.infer<typeof createPagoSchema>;
export type UpdatePagoDto = z.infer<typeof updatePagoSchema>;
