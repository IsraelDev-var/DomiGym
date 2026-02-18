import { RutinaRepository } from './rutina.repository';
import { NotFoundError } from '../../shared/errors';

export class RutinaService {
  constructor(private readonly repo: RutinaRepository) {}

  findAll(miembroId?: number) {
    return this.repo.findAll(miembroId);
  }

  async findById(id: number) {
    const rutina = await this.repo.findById(id);
    if (!rutina) throw new NotFoundError('Rutina');
    return rutina;
  }

  findActivaByMiembro(miembroId: number) {
    return this.repo.findActivaByMiembro(miembroId);
  }

  create(data: { miembroId: number; nombre: string; descripcion?: string; diasSemana: number; objetivo: string }) {
    return this.repo.create(data);
  }

  async update(id: number, data: Partial<{ nombre: string; descripcion: string; diasSemana: number; objetivo: string; activa: boolean }>) {
    await this.findById(id);
    return this.repo.update(id, data);
  }

  async delete(id: number) {
    await this.findById(id);
    return this.repo.delete(id);
  }

  async addEjercicio(rutinaId: number, data: { nombre: string; dia: string; series: number; repeticiones: number; descanso: number; notas?: string }) {
    await this.findById(rutinaId);
    return this.repo.addEjercicio(rutinaId, data);
  }

  async deleteEjercicio(rutinaId: number, ejercicioId: number) {
    await this.findById(rutinaId);
    return this.repo.deleteEjercicio(ejercicioId);
  }
}
