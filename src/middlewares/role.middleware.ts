import { Request, Response, NextFunction } from 'express';
import { Rol } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../shared/errors';

// Factory: genera un middleware de autorización por roles
export const authorize = (...roles: Rol[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.user.rol)) {
      return next(
        new ForbiddenError(
          `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`,
        ),
      );
    }

    next();
  };
};
