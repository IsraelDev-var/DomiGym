import { Router } from 'express';
import { DietaController } from './dieta.controller';
import { DietaService } from './dieta.service';
import { DietaRepository } from './dieta.repository';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();
const repo = new DietaRepository();
const service = new DietaService(repo);
const controller = new DietaController(service);

router.use(authenticate);

router.get('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.findAll);
router.get('/:id', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.findById);

router.post('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.create);
router.put('/:id', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.update);
router.delete('/:id', authorize('ADMIN', 'GERENTE'), controller.delete);

router.post('/:id/comidas', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.addComida);
router.delete('/:id/comidas/:comidaId', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.deleteComida);

export default router;
