import { EstadoMembresia } from '@prisma/client';
import { MiembroRepository } from './miembro.repository';
import { ConflictError, NotFoundError } from '../../shared/errors';
import type { CreateMiembroDto, UpdateMiembroDto } from './miembro.schema';

export class MiembroService {
  constructor(private readonly repo: MiembroRepository) {}

  findAll(filtros?: { sucursalId?: number; estadoMembresia?: EstadoMembresia }) {
    return this.repo.findAll(filtros);
  }

  async findById(id: number) {
    const miembro = await this.repo.findById(id);
    if (!miembro) throw new NotFoundError('Miembro');
    return miembro;
  }

  async create(dto: CreateMiembroDto) {
    // Un usuario solo puede ser miembro una vez
    const existe = await this.repo.findByUsuarioId(dto.usuarioId);
    if (existe) throw new ConflictError('El usuario ya tiene una membresía registrada');

    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateMiembroDto) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }

  async renovar(id: number, planMembresiaId: number, fechaFin: Date) {
    await this.findById(id);
    return this.repo.update(id, {
      planMembresiaId,
      fechaFin,
      estadoMembresia: 'ACTIVA',
    });
  }

  async verificarAcceso(miembroId: number) {
    const tieneAcceso = await this.repo.verificarAcceso(miembroId);
    return { miembroId, tieneAcceso };
  }
}
