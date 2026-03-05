import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { facturaController } from './factura.controller';
import { createFacturaSchema, updateFacturaSchema, idParamSchema } from './factura.schema';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize('ADMIN', 'GERENTE', 'EMPLEADO'),
  facturaController.findAll,
);

router.get(
  '/:id',
  authorize('ADMIN', 'GERENTE', 'EMPLEADO'),
  validate(idParamSchema, 'params'),
  facturaController.findById,
);

router.get(
  '/:id/pdf',
  authorize('ADMIN', 'GERENTE', 'EMPLEADO'),
  validate(idParamSchema, 'params'),
  facturaController.getPdf,
);

router.post(
  '/',
  authorize('ADMIN', 'GERENTE', 'EMPLEADO'),
  validate(createFacturaSchema),
  facturaController.create,
);

router.patch(
  '/:id',
  authorize('ADMIN', 'GERENTE'),
  validate(idParamSchema, 'params'),
  validate(updateFacturaSchema),
  facturaController.update,
);

export default router;
