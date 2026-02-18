import { Router } from 'express';
import { SucursalController } from './sucursal.controller';
import { SucursalService } from './sucursal.service';
import { SucursalRepository } from './sucursal.repository';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createSucursalSchema, updateSucursalSchema, idParamSchema } from './sucursal.schema';

const router = Router();
const repo = new SucursalRepository();
const service = new SucursalService(repo);
const controller = new SucursalController(service);

router.use(authenticate);

router.get('/', controller.findAll);
router.get('/:id', validate(idParamSchema, 'params'), controller.findById);

router.post('/', authorize('ADMIN'), validate(createSucursalSchema), controller.create);
router.put('/:id', authorize('ADMIN'), validate(idParamSchema, 'params'), validate(updateSucursalSchema), controller.update);
router.delete('/:id', authorize('ADMIN'), validate(idParamSchema, 'params'), controller.delete);

export default router;
