import { SucursalRepository } from './sucursal.repository';
import { NotFoundError } from '../../shared/errors';
import type { CreateSucursalDto, UpdateSucursalDto } from './sucursal.schema';

export class SucursalService {
  constructor(private readonly repo: SucursalRepository) {}

  findAll(soloActivas?: boolean) {
    return this.repo.findAll(soloActivas);
  }

  async findById(id: number) {
    const sucursal = await this.repo.findById(id);
    if (!sucursal) throw new NotFoundError('Sucursal');
    return sucursal;
  }

  create(dto: CreateSucursalDto) {
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateSucursalDto) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }

  async delete(id: number) {
    await this.findById(id);
    return this.repo.delete(id);
  }
}
