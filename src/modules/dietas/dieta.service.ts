import { DietaRepository } from './dieta.repository';
import { NotFoundError } from '../../shared/errors';

export class DietaService {
  constructor(private readonly repo: DietaRepository) {}

  findAll(miembroId?: number) {
    return this.repo.findAll(miembroId);
  }

  async findById(id: number) {
    const dieta = await this.repo.findById(id);
    if (!dieta) throw new NotFoundError('Plan de dieta');
    return dieta;
  }

  findActivoByMiembro(miembroId: number) {
    return this.repo.findActivoByMiembro(miembroId);
  }

  create(data: { miembroId: number; nombre: string; objetivo: string; caloriasObj?: number }) {
    return this.repo.create(data);
  }

  async update(id: number, data: Partial<{ nombre: string; objetivo: string; caloriasObj: number; activo: boolean }>) {
    await this.findById(id);
    return this.repo.update(id, data);
  }

  async delete(id: number) {
    await this.findById(id);
    return this.repo.delete(id);
  }

  async addComida(planDietaId: number, data: { tipo: string; descripcion: string; calorias?: number; proteinas?: number; carbos?: number; grasas?: number }) {
    await this.findById(planDietaId);
    return this.repo.addComida(planDietaId, data);
  }

  async deleteComida(planDietaId: number, comidaId: number) {
    await this.findById(planDietaId);
    return this.repo.deleteComida(comidaId);
  }
}
