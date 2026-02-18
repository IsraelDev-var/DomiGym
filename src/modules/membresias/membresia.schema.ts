import { z } from 'zod';

export const createMembresiaSchema = z.object({
  nombre: z.string().min(2).max(100),
  duracionDias: z.number().int().positive('La duración debe ser positiva'),
  precio: z.number().positive('El precio debe ser positivo'),
  descripcion: z.string().optional(),
  estado: z.boolean().default(true),
});

export const updateMembresiaSchema = createMembresiaSchema.partial();

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateMembresiaDto = z.infer<typeof createMembresiaSchema>;
export type UpdateMembresiaDto = z.infer<typeof updateMembresiaSchema>;
