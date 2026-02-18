import { z } from 'zod';
import { TipoAcceso } from '@prisma/client';

export const registrarAccesoSchema = z.object({
  miembroId: z.number().int().positive(),
  sucursalId: z.number().int().positive(),
  tipoAcceso: z.nativeEnum(TipoAcceso),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type RegistrarAccesoDto = z.infer<typeof registrarAccesoSchema>;
