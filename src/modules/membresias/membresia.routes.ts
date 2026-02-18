import { Router } from 'express';
import { MembresiaController } from './membresia.controller';
import { MembresiaService } from './membresia.service';
import { MembresiaRepository } from './membresia.repository';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createMembresiaSchema, updateMembresiaSchema, idParamSchema } from './membresia.schema';

const router = Router();
const repo = new MembresiaRepository();
const service = new MembresiaService(repo);
const controller = new MembresiaController(service);

// Público: cualquier usuario autenticado puede ver los planes
router.get('/', authenticate, controller.findAll);
router.get('/:id', authenticate, validate(idParamSchema, 'params'), controller.findById);

// Solo Admin puede gestionar planes
router.post('/', authenticate, authorize('ADMIN'), validate(createMembresiaSchema), controller.create);
router.put('/:id', authenticate, authorize('ADMIN'), validate(idParamSchema, 'params'), validate(updateMembresiaSchema), controller.update);
router.delete('/:id', authenticate, authorize('ADMIN'), validate(idParamSchema, 'params'), controller.delete);

export default router;
