import { InventarioRepository } from './inventario.repository';
import { NotFoundError, ValidationError } from '../../shared/errors';
import type { CreateInventarioDto, UpdateInventarioDto, AjustarStockDto } from './inventario.schema';

export class InventarioService {
  constructor(private readonly repo: InventarioRepository) {}

  findAll(filtros?: { sucursalId?: number; categoria?: string }) {
    return this.repo.findAll(filtros);
  }

  async findById(id: number) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundError('Item de inventario');
    return item;
  }

  create(dto: CreateInventarioDto) {
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateInventarioDto) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }

  async ajustarStock(id: number, dto: AjustarStockDto) {
    const item = await this.findById(id);
    const delta = dto.operacion === 'agregar' ? dto.cantidad : -dto.cantidad;

    if (dto.operacion === 'restar' && item.cantidad + delta < 0) {
      throw new ValidationError('Stock insuficiente para realizar la operación');
    }

    return this.repo.ajustarStock(id, delta);
  }

  async delete(id: number) {
    await this.findById(id);
    return this.repo.delete(id);
  }
}
