import { Router } from 'express';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { UsuarioRepository } from './usuario.repository';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createUsuarioSchema, updateUsuarioSchema, idParamSchema } from './usuario.schema';

const router = Router();
const repo = new UsuarioRepository();
const service = new UsuarioService(repo);
const controller = new UsuarioController(service);

// Todas las rutas requieren autenticación
router.use(authenticate);

// GET /api/usuarios — Admin ve solo CLIENTE, Gerente ve todos
router.get('/', authorize('ADMIN', 'GERENTE'), controller.findAll);
router.get('/:id', authorize('ADMIN', 'GERENTE'), validate(idParamSchema, 'params'), controller.findById);

// POST — ADMIN crea CLIENTE / GERENTE crea cualquier rol (validado en controller)
router.post('/', authorize('ADMIN', 'GERENTE'), validate(createUsuarioSchema), controller.create);

// PUT — ADMIN modifica solo CLIENTE / GERENTE modifica cualquiera (validado en controller)
router.put('/:id', authorize('ADMIN', 'GERENTE'), validate(idParamSchema, 'params'), validate(updateUsuarioSchema), controller.update);

// DELETE — ADMIN desactiva solo CLIENTE / GERENTE desactiva cualquiera (validado en controller)
router.delete('/:id', authorize('ADMIN', 'GERENTE'), validate(idParamSchema, 'params'), controller.delete);

export default router;
