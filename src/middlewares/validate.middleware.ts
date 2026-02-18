import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type ValidationTarget = 'body' | 'params' | 'query';

// Factory: genera un middleware de validación Zod reutilizable
export const validate = (schema: ZodSchema, target: ValidationTarget = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return next(result.error); // El errorMiddleware lo captura
    }

    req[target] = result.data; // Datos limpios y tipados
    next();
  };
};
