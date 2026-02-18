import { MembresiaRepository } from './membresia.repository';
import { NotFoundError } from '../../shared/errors';
import type { CreateMembresiaDto, UpdateMembresiaDto } from './membresia.schema';

export class MembresiaService {
  constructor(private readonly repo: MembresiaRepository) {}

  findAll(soloActivos?: boolean) {
    return this.repo.findAll(soloActivos);
  }

  async findById(id: number) {
    const plan = await this.repo.findById(id);
    if (!plan) throw new NotFoundError('Plan de membresía');
    return plan;
  }

  create(dto: CreateMembresiaDto) {
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateMembresiaDto) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }

  async delete(id: number) {
    await this.findById(id);
    return this.repo.delete(id);
  }
}
