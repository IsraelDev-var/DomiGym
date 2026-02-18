import { Router } from 'express';
import { RutinaController } from './rutina.controller';
import { RutinaService } from './rutina.service';
import { RutinaRepository } from './rutina.repository';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();
const repo = new RutinaRepository();
const service = new RutinaService(repo);
const controller = new RutinaController(service);

router.use(authenticate);

router.get('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.findAll);
router.get('/:id', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.findById);

router.post('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.create);
router.put('/:id', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.update);
router.delete('/:id', authorize('ADMIN', 'GERENTE'), controller.delete);

router.post('/:id/ejercicios', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.addEjercicio);
router.delete('/:id/ejercicios/:ejercicioId', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.deleteEjercicio);

export default router;
