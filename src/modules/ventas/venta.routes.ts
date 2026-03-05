import { Router } from 'express';
import { VentaController } from './venta.controller';
import { VentaService } from './venta.service';
import { VentaRepository } from './venta.repository';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createVentaSchema, updateVentaSchema, idParamSchema } from './venta.schema';

const router = Router();
const repo = new VentaRepository();
const service = new VentaService(repo);
const controller = new VentaController(service);

router.use(authenticate);

// /reporte debe ir antes de /:id para evitar conflicto de parámetros
router.get('/reporte', authorize('ADMIN', 'GERENTE'), controller.reporte);

router.get('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.findAll);
router.get('/:id', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(idParamSchema, 'params'), controller.findById);
router.get('/:id/pdf', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(idParamSchema, 'params'), controller.getPdf);

router.post('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(createVentaSchema), controller.create);
router.patch('/:id', authorize('ADMIN', 'GERENTE'), validate(idParamSchema, 'params'), validate(updateVentaSchema), controller.update);

export default router;
