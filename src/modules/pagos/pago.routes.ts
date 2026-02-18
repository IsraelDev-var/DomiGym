import { Router } from 'express';
import { PagoController } from './pago.controller';
import { PagoService } from './pago.service';
import { PagoRepository } from './pago.repository';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createPagoSchema, updatePagoSchema, idParamSchema } from './pago.schema';

const router = Router();
const repo = new PagoRepository();
const service = new PagoService(repo);
const controller = new PagoController(service);

router.use(authenticate);

router.get('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.findAll);
router.get('/reporte', authorize('ADMIN', 'GERENTE'), controller.reporte);
router.get('/:id', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(idParamSchema, 'params'), controller.findById);

router.post('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(createPagoSchema), controller.create);
router.patch('/:id', authorize('ADMIN', 'GERENTE'), validate(idParamSchema, 'params'), validate(updatePagoSchema), controller.update);

export default router;
