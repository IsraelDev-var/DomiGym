import { prisma } from '../../lib/prisma';
import { EstadoVenta } from './venta.schema'; 
import { VentaRepository } from './venta.repository';
import { NotFoundError, ValidationError } from '../../shared/errors';
import type { CreateVentaDto, UpdateVentaDto, ItemVentaDto } from './venta.schema';

export class VentaService {
  constructor(private readonly repo: VentaRepository) {}

  findAll(filtros?: { sucursalId?: number; estado?: EstadoVenta; desde?: Date; hasta?: Date }) {
    return this.repo.findAll(filtros);
  }

  async findById(id: number) {
    const venta = await this.repo.findById(id);
    if (!venta) throw new NotFoundError('Venta');
    return venta;
  }

  async create(dto: CreateVentaDto) {
    // Validar stock suficiente para items de tipo PRODUCTO
    for (const item of dto.items as ItemVentaDto[]) {
      if (item.tipo === 'PRODUCTO' && item.inventarioId) {
        const inv = await prisma.inventario.findUnique({ where: { id: item.inventarioId } });
        if (!inv) throw new NotFoundError(`Producto con id ${item.inventarioId}`);
        if (inv.cantidad < item.cantidad) {
          throw new ValidationError(
            `Stock insuficiente para "${inv.nombreProducto}". Disponible: ${inv.cantidad}, solicitado: ${item.cantidad}`
          );
        }
      }
    }

    // Calcular totales
    const itemsConSubtotal = (dto.items as ItemVentaDto[]).map((item) => ({
      ...item,
      subtotal: item.cantidad * item.precioUnitario,
    }));

    const subtotalBruto = itemsConSubtotal.reduce((acc, i) => acc + i.subtotal, 0);
    const impuesto = parseFloat((subtotalBruto * 0.12).toFixed(2));
    const total = parseFloat((subtotalBruto + impuesto).toFixed(2));
    const subtotal = parseFloat(subtotalBruto.toFixed(2));

    // Generar número de venta
    const count = await this.repo.countTotal();
    const year = new Date().getFullYear();
    const numeroVenta = `VTA-${year}-${String(count + 1).padStart(6, '0')}`;

    return this.repo.create(
      {
        sucursalId: dto.sucursalId,
        miembroId: dto.miembroId,
        clienteNombre: dto.clienteNombre,
        numeroVenta,
        subtotal,
        impuesto,
        total,
        metodoPago: dto.metodoPago,
        notas: dto.notas,
      },
      itemsConSubtotal
    );
  }

  async update(id: number, dto: UpdateVentaDto) {
    const venta = await this.findById(id);

    // Si se anula o devuelve, restaurar stock
    if (
      (dto.estado === 'ANULADA' || dto.estado === 'DEVUELTA') &&
      venta.estado === 'COMPLETADA'
    ) {
      await this.repo.restoreStock(id);
    }

    return this.repo.update(id, { estado: dto.estado as EstadoVenta, notas: dto.notas });
  }

  async reporte(desde: Date, hasta: Date, sucursalId?: number) {
    const { aggregate, porEstado } = await this.repo.reporteVentas(desde, hasta, sucursalId);

    const total = Number(aggregate._sum.total ?? 0);
    const cantidad = aggregate._count.id;
    const ticketPromedio = cantidad > 0 ? parseFloat((total / cantidad).toFixed(2)) : 0;

    const porEstadoMap: Record<string, { cantidad: number; total: number }> = {};
    for (const row of porEstado) {
      porEstadoMap[row.estado] = { cantidad: row._count.id, total: Number(row._sum.total ?? 0) };
    }

    return { total, cantidad, ticketPromedio, porEstado: porEstadoMap };
  }
}
