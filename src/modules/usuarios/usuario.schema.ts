import { z } from 'zod';
import { Rol } from '@prisma/client';

export const createUsuarioSchema = z.object({
  nombre: z.string().min(2).max(100),
  email: z.string().email(),
  contrasena: z.string().min(6),
  rol: z.nativeEnum(Rol).default('CLIENTE'),
});

export const updateUsuarioSchema = z.object({
  nombre: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  rol: z.nativeEnum(Rol).optional(),
  estado: z.boolean().optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateUsuarioDto = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDto = z.infer<typeof updateUsuarioSchema>;
