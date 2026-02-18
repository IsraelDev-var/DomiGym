import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { env } from '../../config/env';
import { UnauthorizedError, ConflictError, NotFoundError } from '../../shared/errors';
import type { LoginDto, RegisterDto, ChangePasswordDto } from './auth.schema';
import type { JwtPayload } from '../../middlewares/auth.middleware';

export class AuthService {
  private readonly SALT_ROUNDS = 10;

  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  async login(dto: LoginDto) {
    const usuario = await prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (!usuario || !usuario.estado) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const passwordValida = await bcrypt.compare(dto.contrasena, usuario.contrasena);
    if (!passwordValida) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const token = this.generateToken({ userId: usuario.id, rol: usuario.rol });

    const { contrasena: _, ...usuarioSinPassword } = usuario;
    return { token, usuario: usuarioSinPassword };
  }

  async register(dto: RegisterDto) {
    const existe = await prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existe) {
      throw new ConflictError('Ya existe un usuario con ese email');
    }

    const hash = await bcrypt.hash(dto.contrasena, this.SALT_ROUNDS);

    const usuario = await prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        contrasena: hash,
        rol: 'CLIENTE',
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        estado: true,
        fechaRegistro: true,
      },
    });

    const token = this.generateToken({ userId: usuario.id, rol: usuario.rol });
    return { token, usuario };
  }

  async cambiarPassword(userId: number, dto: ChangePasswordDto) {
    const usuario = await prisma.usuario.findUnique({ where: { id: userId } });
    if (!usuario) throw new NotFoundError('Usuario');

    const valida = await bcrypt.compare(dto.contrasenaActual, usuario.contrasena);
    if (!valida) throw new UnauthorizedError('La contraseña actual es incorrecta');

    const hash = await bcrypt.hash(dto.contrasenaNueva, this.SALT_ROUNDS);
    await prisma.usuario.update({
      where: { id: userId },
      data: { contrasena: hash },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async perfil(userId: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        estado: true,
        fechaRegistro: true,
        miembro: {
          include: {
            planMembresia: true,
            sucursal: { select: { id: true, nombre: true } },
          },
        },
      },
    });
    if (!usuario) throw new NotFoundError('Usuario');
    return usuario;
  }
}
