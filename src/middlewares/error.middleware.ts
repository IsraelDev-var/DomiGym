import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../shared/errors';
import { env } from '../config/env';

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Error de validación Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors.map((e) => ({
        campo: e.path.join('.'),
        mensaje: e.message,
      })),
    });
    return;
  }

  // Errores operacionales propios
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Errores de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'Ya existe un registro con ese valor único',
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
      });
      return;
    }
  }

  // Error genérico
  const isDev = env.NODE_ENV === 'development';
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(isDev && { stack: err.stack }),
  });
};
