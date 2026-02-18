import { z } from 'zod';

const horaSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)');

export const createSucursalSchema = z.object({
  nombre: z.string().min(2).max(100),
  direccion: z.string().min(5).max(255),
  telefono: z.string().max(20).optional(),
  ciudad: z.string().min(2).max(100),
  horarioApertura: horaSchema,
  horarioCierre: horaSchema,
  gerenteId: z.number().int().positive().optional(),
});

export const updateSucursalSchema = createSucursalSchema.partial();

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateSucursalDto = z.infer<typeof createSucursalSchema>;
export type UpdateSucursalDto = z.infer<typeof updateSucursalSchema>;
