import { z } from 'zod';
import { EstadoMembresia } from '@prisma/client';

export const createMiembroSchema = z.object({
  usuarioId: z.number().int().positive(),
  sucursalId: z.number().int().positive(),
  planMembresiaId: z.number().int().positive(),
  fechaInicio: z.coerce.date(),
  fechaFin: z.coerce.date(),
  estadoMembresia: z.nativeEnum(EstadoMembresia).default('ACTIVA'),
});

export const updateMiembroSchema = z.object({
  sucursalId: z.number().int().positive().optional(),
  planMembresiaId: z.number().int().positive().optional(),
  estadoMembresia: z.nativeEnum(EstadoMembresia).optional(),
  fechaInicio: z.coerce.date().optional(),
  fechaFin: z.coerce.date().optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateMiembroDto = z.infer<typeof createMiembroSchema>;
export type UpdateMiembroDto = z.infer<typeof updateMiembroSchema>;
