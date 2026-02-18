import { Router } from 'express';
import { clienteController } from './cliente.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('CLIENTE'));

router.get('/perfil', clienteController.perfil);
router.get('/pagos', clienteController.pagos);
router.get('/accesos', clienteController.accesos);
router.get('/rutina', clienteController.rutina);
router.get('/dieta', clienteController.dieta);
router.get('/recomendaciones', clienteController.recomendaciones);

export default router;
