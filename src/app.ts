import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { swaggerSpec } from './config/swagger';

// Rutas de módulos
import authRoutes from './modules/auth/auth.routes';
import usuarioRoutes from './modules/usuarios/usuario.routes';
import membresiaRoutes from './modules/membresias/membresia.routes';
import miembroRoutes from './modules/miembros/miembro.routes';
import pagoRoutes from './modules/pagos/pago.routes';
import accesoRoutes from './modules/accesos/acceso.routes';
import sucursalRoutes from './modules/sucursales/sucursal.routes';
import inventarioRoutes from './modules/inventario/inventario.routes';
import rutinaRoutes from './modules/rutinas/rutina.routes';
import dietaRoutes from './modules/dietas/dieta.routes';
import recomendacionRoutes from './modules/recomendaciones/recomendacion.routes';
import clienteRoutes from './modules/cliente/cliente.routes';

const app = express();

// ── Seguridad ─────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

// ── Parsers ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logger ────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// ── Health Check ──────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Swagger Docs ──────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Rutas API ─────────────────────────────────────────────
const API = '/api';

app.use(`${API}/auth`, authRoutes);
app.use(`${API}/usuarios`, usuarioRoutes);
app.use(`${API}/planes`, membresiaRoutes);
app.use(`${API}/miembros`, miembroRoutes);
app.use(`${API}/pagos`, pagoRoutes);
app.use(`${API}/accesos`, accesoRoutes);
app.use(`${API}/sucursales`, sucursalRoutes);
app.use(`${API}/inventario`, inventarioRoutes);
app.use(`${API}/rutinas`, rutinaRoutes);
app.use(`${API}/dietas`, dietaRoutes);
app.use(`${API}/recomendaciones`, recomendacionRoutes);
app.use(`${API}/cliente`, clienteRoutes);

// ── 404 ───────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// ── Error Handler (siempre al final) ─────────────────────
app.use(errorMiddleware);

export default app;
