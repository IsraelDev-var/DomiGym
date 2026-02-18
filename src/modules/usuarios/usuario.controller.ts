import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from './usuario.service';
import { sendSuccess, sendCreated } from '../../shared/response';
import { ForbiddenError } from '../../shared/errors';
import { Rol } from '@prisma/client';

export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { rol, estado } = req.query;

      // ADMIN solo gestiona usuarios CLIENTE
      const rolFiltro = req.user!.rol === 'ADMIN' ? 'CLIENTE' : (rol as Rol | undefined);

      const filtros = {
        ...(rolFiltro && { rol: rolFiltro }),
        ...(estado !== undefined && { estado: estado === 'true' }),
      };
      const data = await this.service.findAll(Object.keys(filtros).length ? filtros : undefined);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.findById(Number(req.params.id));
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const creatorRol = req.user!.rol;
      const rolSolicitado: Rol = req.body.rol;

      // ADMIN solo puede crear CLIENTE
      if (creatorRol === 'ADMIN' && rolSolicitado !== 'CLIENTE') {
        return next(new ForbiddenError('Como ADMIN solo puedes crear usuarios de tipo CLIENTE'));
      }

      // Solo GERENTE puede crear ADMIN
      if (rolSolicitado === 'ADMIN' && creatorRol !== 'GERENTE') {
        return next(new ForbiddenError('Solo el GERENTE puede crear usuarios con rol ADMIN'));
      }

      const data = await this.service.create(req.body);
      sendCreated(res, data, 'Usuario creado exitosamente');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const creatorRol = req.user!.rol;
      const targetId = Number(req.params.id);

      // ADMIN solo puede modificar usuarios CLIENTE
      if (creatorRol === 'ADMIN') {
        const target = await this.service.findById(targetId);
        if (target.rol !== 'CLIENTE') {
          return next(new ForbiddenError('Como ADMIN solo puedes modificar usuarios de tipo CLIENTE'));
        }
        if (req.body.rol && req.body.rol !== 'CLIENTE') {
          return next(new ForbiddenError('Como ADMIN no puedes cambiar el rol de un usuario'));
        }
      }

      const data = await this.service.update(targetId, req.body);
      sendSuccess(res, data, 'Usuario actualizado exitosamente');
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const creatorRol = req.user!.rol;
      const targetId = Number(req.params.id);

      // ADMIN solo puede desactivar usuarios CLIENTE
      if (creatorRol === 'ADMIN') {
        const target = await this.service.findById(targetId);
        if (target.rol !== 'CLIENTE') {
          return next(new ForbiddenError('Como ADMIN solo puedes desactivar usuarios de tipo CLIENTE'));
        }
      }

      const data = await this.service.delete(targetId);
      sendSuccess(res, data, 'Usuario desactivado exitosamente');
    } catch (err) {
      next(err);
    }
  };
}
