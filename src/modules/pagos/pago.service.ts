import { randomUUID } from 'crypto';
import { EstadoPago } from '@prisma/client';
import { PagoRepository } from './pago.repository';
import { NotFoundError } from '../../shared/errors';
import type { CreatePagoDto, UpdatePagoDto } from './pago.schema';

export class PagoService {
  constructor(private readonly repo: PagoRepository) {}

  findAll(filtros?: { miembroId?: number; estado?: EstadoPago }) {
    return this.repo.findAll(filtros);
  }

  async findById(id: number) {
    const pago = await this.repo.findById(id);
    if (!pago) throw new NotFoundError('Pago');
    return pago;
  }

  findByMiembro(miembroId: number) {
    return this.repo.findByMiembro(miembroId);
  }

  create(dto: CreatePagoDto) {
    // Genera número de comprobante único
    const numeroComprobante = `DG-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
    return this.repo.create({ ...dto, numeroComprobante });
  }

  async update(id: number, dto: UpdatePagoDto) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }

  reporteIngresos(desde: Date, hasta: Date) {
    return this.repo.totalIngresosPorPeriodo(desde, hasta);
  }
}
