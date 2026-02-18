import { AccesoRepository } from './acceso.repository';
import { MiembroRepository } from '../miembros/miembro.repository';
import type { RegistrarAccesoDto } from './acceso.schema';

export class AccesoService {
  constructor(
    private readonly repo: AccesoRepository,
    private readonly miembroRepo: MiembroRepository,
  ) {}

  findAll(filtros?: { miembroId?: number; sucursalId?: number }) {
    return this.repo.findAll(filtros);
  }

  findByMiembro(miembroId: number) {
    return this.repo.findByMiembro(miembroId);
  }

  async registrar(dto: RegistrarAccesoDto) {
    // Valida si el miembro tiene membresía activa
    const tieneAcceso = await this.miembroRepo.verificarAcceso(dto.miembroId);
    const estado = tieneAcceso ? 'PERMITIDO' : 'DENEGADO';

    return this.repo.registrar({ ...dto, estado });
  }
}
