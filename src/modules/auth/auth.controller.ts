import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess, sendCreated } from '../../shared/response';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      sendSuccess(res, result, 'Login exitoso');
    } catch (err) {
      next(err);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      sendCreated(res, result, 'Registro exitoso');
    } catch (err) {
      next(err);
    }
  };

  perfil = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.perfil(req.user!.userId);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  };

  cambiarPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.cambiarPassword(req.user!.userId, req.body);
      sendSuccess(res, result, 'Contraseña actualizada');
    } catch (err) {
      next(err);
    }
  };
}
