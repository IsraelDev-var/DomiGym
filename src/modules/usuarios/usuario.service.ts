import bcrypt from 'bcryptjs';
import { Rol } from '@prisma/client';
import { UsuarioRepository } from './usuario.repository';
import { ConflictError, NotFoundError } from '../../shared/errors';
import type { CreateUsuarioDto, UpdateUsuarioDto } from './usuario.schema';

export class UsuarioService {
  constructor(private readonly repo: UsuarioRepository) {}

  async findAll(filtros?: { rol?: Rol; estado?: boolean }) {
    return this.repo.findAll(filtros);
  }

  async findById(id: number) {
    const usuario = await this.repo.findById(id);
    if (!usuario) throw new NotFoundError('Usuario');
    return usuario;
  }

  async create(dto: CreateUsuarioDto) {
    const existe = await this.repo.findByEmail(dto.email);
    if (existe) throw new ConflictError('Ya existe un usuario con ese email');

    const hash = await bcrypt.hash(dto.contrasena, 10);
    return this.repo.create({ ...dto, contrasena: hash });
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findById(id); // Lanza NotFoundError si no existe
    return this.repo.update(id, dto);
  }

  async delete(id: number) {
    await this.findById(id);
    return this.repo.delete(id);
  }
}
