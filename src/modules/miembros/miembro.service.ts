import bcrypt from 'bcryptjs';
import { EstadoMembresia } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { MiembroRepository } from './miembro.repository';
import { ConflictError, NotFoundError } from '../../shared/errors';
import type { CreateMiembroDto, UpdateMiembroDto, RegistroCompletoDto } from './miembro.schema';

export class MiembroService {
  constructor(private readonly repo: MiembroRepository) {}

  findAll(filtros?: { sucursalId?: number; estadoMembresia?: EstadoMembresia }) {
    return this.repo.findAll(filtros);
  }

  async findById(id: number) {
    const miembro = await this.repo.findById(id);
    if (!miembro) throw new NotFoundError('Miembro');
    return miembro;
  }

  async create(dto: CreateMiembroDto) {
    // Un usuario solo puede ser miembro una vez
    const existe = await this.repo.findByUsuarioId(dto.usuarioId);
    if (existe) throw new ConflictError('El usuario ya tiene una membresía registrada');

    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateMiembroDto) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }

  async renovar(id: number, planMembresiaId: number, fechaFin: Date) {
    await this.findById(id);
    return this.repo.update(id, {
      planMembresiaId,
      fechaFin,
      estadoMembresia: 'ACTIVA',
    });
  }

  async registrarCompleto(dto: RegistroCompletoDto) {
    // Verificar email único
    const usuarioExiste = await prisma.usuario.findUnique({ where: { email: dto.email } });
    if (usuarioExiste) throw new ConflictError('Ya existe un usuario con ese email');

    const hash = await bcrypt.hash(dto.contrasena, 10);

    // Crear usuario y miembro en una sola transacción
    const resultado = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: { nombre: dto.nombre, email: dto.email, contrasena: hash, rol: 'CLIENTE' },
      });
      const miembro = await tx.miembro.create({
        data: {
          usuarioId: usuario.id,
          sucursalId: dto.sucursalId,
          planMembresiaId: dto.planMembresiaId,
          fechaInicio: dto.fechaInicio,
          fechaFin: dto.fechaFin,
          estadoMembresia: 'ACTIVA',
        },
        include: {
          usuario: { select: { id: true, nombre: true, email: true } },
          sucursal: { select: { id: true, nombre: true } },
          planMembresia: { select: { id: true, nombre: true, precio: true } },
        },
      });
      return miembro;
    });

    return resultado;
  }

  async verificarAcceso(miembroId: number) {
    const tieneAcceso = await this.repo.verificarAcceso(miembroId);
    return { miembroId, tieneAcceso };
  }
}
