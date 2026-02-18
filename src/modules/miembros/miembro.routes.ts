import { Router } from 'express';
import { MiembroController } from './miembro.controller';
import { MiembroService } from './miembro.service';
import { MiembroRepository } from './miembro.repository';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createMiembroSchema, updateMiembroSchema, idParamSchema } from './miembro.schema';

const router = Router();
const repo = new MiembroRepository();
const service = new MiembroService(repo);
const controller = new MiembroController(service);

router.use(authenticate);

router.get('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.findAll);
router.get('/:id', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(idParamSchema, 'params'), controller.findById);
router.get('/:id/verificar-acceso', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(idParamSchema, 'params'), controller.verificarAcceso);

router.post('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(createMiembroSchema), controller.create);
router.put('/:id', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(idParamSchema, 'params'), validate(updateMiembroSchema), controller.update);
router.post('/:id/renovar', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(idParamSchema, 'params'), controller.renovar);

export default router;
