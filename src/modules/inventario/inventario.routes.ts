import { Router } from 'express';
import { InventarioController } from './inventario.controller';
import { InventarioService } from './inventario.service';
import { InventarioRepository } from './inventario.repository';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createInventarioSchema, updateInventarioSchema, ajustarStockSchema, idParamSchema } from './inventario.schema';

const router = Router();
const repo = new InventarioRepository();
const service = new InventarioService(repo);
const controller = new InventarioController(service);

router.use(authenticate);

router.get('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.findAll);
router.get('/:id', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(idParamSchema, 'params'), controller.findById);

router.post('/', authorize('ADMIN', 'GERENTE'), validate(createInventarioSchema), controller.create);
router.put('/:id', authorize('ADMIN', 'GERENTE'), validate(idParamSchema, 'params'), validate(updateInventarioSchema), controller.update);
router.patch('/:id/stock', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(idParamSchema, 'params'), validate(ajustarStockSchema), controller.ajustarStock);
router.delete('/:id', authorize('ADMIN'), validate(idParamSchema, 'params'), controller.delete);

export default router;
