import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Operación exitosa',
  statusCode = 200,
  meta?: Record<string, unknown>,
): Response => {
  const response: ApiResponse<T> = { success: true, message, data };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message = 'Recurso creado exitosamente',
): Response => sendSuccess(res, data, message, 201);

export const sendError = (
  res: Response,
  message = 'Error interno del servidor',
  statusCode = 500,
  errors?: unknown,
): Response => {
  return res.status(statusCode).json({ success: false, message, errors });
};
