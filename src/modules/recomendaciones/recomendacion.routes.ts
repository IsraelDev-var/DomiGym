import { Router } from 'express';
import { RecomendacionController } from './recomendacion.controller';
import { RecomendacionService } from './recomendacion.service';
import { RecomendacionRepository } from './recomendacion.repository';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();
const repo = new RecomendacionRepository();
const service = new RecomendacionService(repo);
const controller = new RecomendacionController(service);

router.use(authenticate);

router.get('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.findAll);
router.get('/:id', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.findById);

router.post('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.create);
router.put('/:id', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.update);
router.delete('/:id', authorize('ADMIN', 'GERENTE'), controller.delete);

export default router;
