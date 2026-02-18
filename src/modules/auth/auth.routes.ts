import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { loginSchema, registerSchema, changePasswordSchema } from './auth.schema';

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

// POST /api/auth/login
router.post('/login', validate(loginSchema), authController.login);

// POST /api/auth/register
router.post('/register', validate(registerSchema), authController.register);

// GET  /api/auth/perfil  (protegida)
router.get('/perfil', authenticate, authController.perfil);

// PUT  /api/auth/cambiar-password  (protegida)
router.put(
  '/cambiar-password',
  authenticate,
  validate(changePasswordSchema),
  authController.cambiarPassword,
);

export default router;
