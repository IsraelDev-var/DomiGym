import { EstadoFactura } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { NotFoundError, ConflictError } from '../../shared/errors';
import { FacturaRepository } from './factura.repository';
import type { CreateFacturaDto, UpdateFacturaDto } from './factura.schema';

export class FacturaService {
  constructor(private readonly repo: FacturaRepository) {}

  findAll(filtros?: { miembroId?: number; estado?: EstadoFactura }) {
    return this.repo.findAll(filtros);
  }

  async findById(id: number) {
    const factura = await this.repo.findById(id);
    if (!factura) throw new NotFoundError('Factura');
    return factura;
  }

  findByMiembro(miembroId: number) {
    return this.repo.findByMiembro(miembroId);
  }

  async create(dto: CreateFacturaDto) {
    // 1. Verificar que el pago existe
    const pago = await prisma.pago.findUnique({
      where: { id: dto.pagoId },
      include: { miembro: true },
    });
    if (!pago) throw new NotFoundError('Pago');

    // 2. Verificar que no tenga ya una factura
    const existe = await this.repo.findByPago(dto.pagoId);
    if (existe) throw new ConflictError('Este pago ya tiene una factura emitida');

    // 3. Calcular montos (IVA 12%)
    const monto = Number(pago.monto);
    const subtotal = parseFloat((monto / 1.12).toFixed(2));
    const impuesto = parseFloat((monto - subtotal).toFixed(2));
    const total = monto;

    // 4. Generar número de factura secuencial: FAC-YYYY-NNNNNN
    const count = await this.repo.countTotal();
    const anio = new Date().getFullYear();
    const seq = String(count + 1).padStart(6, '0');
    const numeroFactura = `FAC-${anio}-${seq}`;

    // 5. Crear factura
    return this.repo.create({
      pagoId: dto.pagoId,
      miembroId: pago.miembro.id,
      numeroFactura,
      subtotal,
      impuesto,
      total,
      notas: dto.notas,
    });
  }

  async update(id: number, dto: UpdateFacturaDto) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }
}
