import { Prisma, Rol } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import type { CreateUsuarioDto, UpdateUsuarioDto } from './usuario.schema';

// Campos públicos (sin contraseña)
const publicSelect = {
  id: true,
  nombre: true,
  email: true,
  rol: true,
  estado: true,
  fechaRegistro: true,
} satisfies Prisma.UsuarioSelect;

// Repository: abstrae todas las operaciones de BD para Usuario
export class UsuarioRepository {
  findAll(filtros?: { rol?: Rol; estado?: boolean }) {
    return prisma.usuario.findMany({
      where: filtros,
      select: publicSelect,
      orderBy: { fechaRegistro: 'desc' },
    });
  }

  findById(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
      select: publicSelect,
    });
  }

  findByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  }

  create(data: CreateUsuarioDto & { contrasena: string }) {
    return prisma.usuario.create({
      data,
      select: publicSelect,
    });
  }

  update(id: number, data: UpdateUsuarioDto) {
    return prisma.usuario.update({
      where: { id },
      data,
      select: publicSelect,
    });
  }

  delete(id: number) {
    // Soft delete: desactivar en lugar de eliminar
    return prisma.usuario.update({
      where: { id },
      data: { estado: false },
      select: publicSelect,
    });
  }
}
