import { RecomendacionRepository } from './recomendacion.repository';
import { NotFoundError } from '../../shared/errors';

export class RecomendacionService {
  constructor(private readonly repo: RecomendacionRepository) {}

  findAll(miembroId?: number) {
    return this.repo.findAll(miembroId);
  }

  async findById(id: number) {
    const rec = await this.repo.findById(id);
    if (!rec) throw new NotFoundError('Recomendación');
    return rec;
  }

  findActivasByMiembro(miembroId: number) {
    return this.repo.findActivasByMiembro(miembroId);
  }

  create(data: { miembroId: number; titulo: string; descripcion: string; categoria: string }) {
    return this.repo.create(data);
  }

  async update(id: number, data: Partial<{ titulo: string; descripcion: string; categoria: string; activa: boolean }>) {
    await this.findById(id);
    return this.repo.update(id, data);
  }

  async delete(id: number) {
    await this.findById(id);
    return this.repo.delete(id);
  }
}
