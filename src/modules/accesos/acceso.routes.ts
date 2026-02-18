import { Router } from 'express';
import { AccesoController } from './acceso.controller';
import { AccesoService } from './acceso.service';
import { AccesoRepository } from './acceso.repository';
import { MiembroRepository } from '../miembros/miembro.repository';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { registrarAccesoSchema } from './acceso.schema';

const router = Router();
const accesoRepo = new AccesoRepository();
const miembroRepo = new MiembroRepository();
const service = new AccesoService(accesoRepo, miembroRepo);
const controller = new AccesoController(service);

router.use(authenticate);

router.get('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.findAll);
router.get('/miembro/:miembroId', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), controller.findByMiembro);

// Registrar entrada/salida (validación de membresía automática)
router.post('/', authorize('ADMIN', 'GERENTE', 'EMPLEADO'), validate(registrarAccesoSchema), controller.registrar);

export default router;
