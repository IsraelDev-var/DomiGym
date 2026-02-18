import { OpenAPIV3 } from 'openapi-types';

const bearerAuth: OpenAPIV3.SecuritySchemeObject = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
};

export const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'DomiGym API',
    version: '1.0.0',
    description: 'API REST para el sistema de gestión de gimnasio DomiGym.',
    contact: { name: 'DomiGym Dev Team' },
  },
  servers: [{ url: '/api', description: 'Base path' }],
  components: {
    securitySchemes: { bearerAuth },
    schemas: {
      // ── Auth ─────────────────────────────────────────────────
      LoginRequest: {
        type: 'object',
        required: ['email', 'contrasena'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@domigym.com' },
          contrasena: { type: 'string', minLength: 6, example: 'secret123' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['nombre', 'email', 'contrasena'],
        properties: {
          nombre: { type: 'string', minLength: 2, example: 'Juan García' },
          email: { type: 'string', format: 'email', example: 'juan@domigym.com' },
          contrasena: { type: 'string', minLength: 6, example: 'secret123' },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['contrasenaActual', 'contrasenaNueva'],
        properties: {
          contrasenaActual: { type: 'string', minLength: 6 },
          contrasenaNueva: { type: 'string', minLength: 6 },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              usuario: { $ref: '#/components/schemas/Usuario' },
            },
          },
        },
      },
      // ── Usuario ───────────────────────────────────────────────
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Juan García' },
          email: { type: 'string', format: 'email' },
          rol: { type: 'string', enum: ['ADMIN', 'GERENTE', 'EMPLEADO'], example: 'EMPLEADO' },
          activo: { type: 'boolean', example: true },
          creadoEn: { type: 'string', format: 'date-time' },
        },
      },
      CreateUsuarioRequest: {
        type: 'object',
        required: ['nombre', 'email', 'contrasena', 'rol'],
        properties: {
          nombre: { type: 'string', minLength: 2, example: 'Ana López' },
          email: { type: 'string', format: 'email', example: 'ana@domigym.com' },
          contrasena: { type: 'string', minLength: 6 },
          rol: { type: 'string', enum: ['ADMIN', 'GERENTE', 'EMPLEADO'] },
        },
      },
      UpdateUsuarioRequest: {
        type: 'object',
        properties: {
          nombre: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          rol: { type: 'string', enum: ['ADMIN', 'GERENTE', 'EMPLEADO'] },
          activo: { type: 'boolean' },
        },
      },
      // ── Sucursal ──────────────────────────────────────────────
      Sucursal: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Sucursal Centro' },
          direccion: { type: 'string', example: 'Av. Principal 123' },
          telefono: { type: 'string', example: '+1234567890' },
          activo: { type: 'boolean', example: true },
        },
      },
      CreateSucursalRequest: {
        type: 'object',
        required: ['nombre', 'direccion'],
        properties: {
          nombre: { type: 'string', example: 'Sucursal Norte' },
          direccion: { type: 'string', example: 'Calle Norte 456' },
          telefono: { type: 'string', example: '+0987654321' },
        },
      },
      UpdateSucursalRequest: {
        type: 'object',
        properties: {
          nombre: { type: 'string' },
          direccion: { type: 'string' },
          telefono: { type: 'string' },
          activo: { type: 'boolean' },
        },
      },
      // ── Plan de Membresía ─────────────────────────────────────
      Membresia: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Plan Mensual' },
          descripcion: { type: 'string', example: 'Acceso ilimitado por 30 días' },
          precio: { type: 'number', format: 'float', example: 49.99 },
          duracionDias: { type: 'integer', example: 30 },
          activo: { type: 'boolean', example: true },
        },
      },
      CreateMembresiaRequest: {
        type: 'object',
        required: ['nombre', 'precio', 'duracionDias'],
        properties: {
          nombre: { type: 'string', example: 'Plan Mensual' },
          descripcion: { type: 'string', example: 'Acceso ilimitado por 30 días' },
          precio: { type: 'number', format: 'float', example: 49.99 },
          duracionDias: { type: 'integer', example: 30 },
        },
      },
      UpdateMembresiaRequest: {
        type: 'object',
        properties: {
          nombre: { type: 'string' },
          descripcion: { type: 'string' },
          precio: { type: 'number', format: 'float' },
          duracionDias: { type: 'integer' },
          activo: { type: 'boolean' },
        },
      },
      // ── Miembro ───────────────────────────────────────────────
      Miembro: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          usuarioId: { type: 'integer', example: 2 },
          sucursalId: { type: 'integer', example: 1 },
          planMembresiaId: { type: 'integer', example: 1 },
          fechaInicio: { type: 'string', format: 'date-time' },
          fechaFin: { type: 'string', format: 'date-time' },
          estadoMembresia: {
            type: 'string',
            enum: ['ACTIVA', 'VENCIDA', 'SUSPENDIDA', 'CANCELADA'],
            example: 'ACTIVA',
          },
        },
      },
      CreateMiembroRequest: {
        type: 'object',
        required: ['usuarioId', 'sucursalId', 'planMembresiaId', 'fechaInicio', 'fechaFin'],
        properties: {
          usuarioId: { type: 'integer', example: 2 },
          sucursalId: { type: 'integer', example: 1 },
          planMembresiaId: { type: 'integer', example: 1 },
          fechaInicio: { type: 'string', format: 'date', example: '2026-02-01' },
          fechaFin: { type: 'string', format: 'date', example: '2026-03-01' },
          estadoMembresia: {
            type: 'string',
            enum: ['ACTIVA', 'VENCIDA', 'SUSPENDIDA', 'CANCELADA'],
            default: 'ACTIVA',
          },
        },
      },
      UpdateMiembroRequest: {
        type: 'object',
        properties: {
          sucursalId: { type: 'integer' },
          planMembresiaId: { type: 'integer' },
          estadoMembresia: {
            type: 'string',
            enum: ['ACTIVA', 'VENCIDA', 'SUSPENDIDA', 'CANCELADA'],
          },
          fechaInicio: { type: 'string', format: 'date' },
          fechaFin: { type: 'string', format: 'date' },
        },
      },
      // ── Pago ──────────────────────────────────────────────────
      Pago: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          miembroId: { type: 'integer', example: 1 },
          monto: { type: 'number', format: 'float', example: 49.99 },
          metodoPago: {
            type: 'string',
            enum: ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'],
            example: 'EFECTIVO',
          },
          estado: {
            type: 'string',
            enum: ['PENDIENTE', 'COMPLETADO', 'FALLIDO'],
            example: 'COMPLETADO',
          },
          fechaPago: { type: 'string', format: 'date-time' },
        },
      },
      CreatePagoRequest: {
        type: 'object',
        required: ['miembroId', 'monto', 'metodoPago'],
        properties: {
          miembroId: { type: 'integer', example: 1 },
          monto: { type: 'number', format: 'float', example: 49.99 },
          metodoPago: {
            type: 'string',
            enum: ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'],
          },
          estado: {
            type: 'string',
            enum: ['PENDIENTE', 'COMPLETADO', 'FALLIDO'],
            default: 'COMPLETADO',
          },
        },
      },
      UpdatePagoRequest: {
        type: 'object',
        properties: {
          estado: { type: 'string', enum: ['PENDIENTE', 'COMPLETADO', 'FALLIDO'] },
        },
      },
      // ── Acceso ────────────────────────────────────────────────
      Acceso: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          miembroId: { type: 'integer', example: 1 },
          tipo: { type: 'string', enum: ['ENTRADA', 'SALIDA'], example: 'ENTRADA' },
          fechaHora: { type: 'string', format: 'date-time' },
          sucursalId: { type: 'integer', example: 1 },
        },
      },
      RegistrarAccesoRequest: {
        type: 'object',
        required: ['miembroId', 'tipo'],
        properties: {
          miembroId: { type: 'integer', example: 1 },
          tipo: { type: 'string', enum: ['ENTRADA', 'SALIDA'] },
          sucursalId: { type: 'integer', example: 1 },
        },
      },
      // ── Inventario ────────────────────────────────────────────
      Inventario: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Pesas 10kg' },
          descripcion: { type: 'string', example: 'Par de pesas de 10 kg' },
          cantidad: { type: 'integer', example: 20 },
          sucursalId: { type: 'integer', example: 1 },
        },
      },
      CreateInventarioRequest: {
        type: 'object',
        required: ['nombre', 'cantidad', 'sucursalId'],
        properties: {
          nombre: { type: 'string', example: 'Pesas 10kg' },
          descripcion: { type: 'string', example: 'Par de pesas de 10 kg' },
          cantidad: { type: 'integer', minimum: 0, example: 20 },
          sucursalId: { type: 'integer', example: 1 },
        },
      },
      UpdateInventarioRequest: {
        type: 'object',
        properties: {
          nombre: { type: 'string' },
          descripcion: { type: 'string' },
          cantidad: { type: 'integer', minimum: 0 },
          sucursalId: { type: 'integer' },
        },
      },
      AjustarStockRequest: {
        type: 'object',
        required: ['ajuste'],
        properties: {
          ajuste: { type: 'integer', example: -5, description: 'Positivo para entrada, negativo para salida' },
        },
      },
      // ── Respuestas genéricas ──────────────────────────────────
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error description' },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Token inválido o no proporcionado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      Forbidden: {
        description: 'Sin permisos para esta acción',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      NotFound: {
        description: 'Recurso no encontrado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    // ── AUTH ────────────────────────────────────────────────────
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        security: [],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          '200': { description: 'Login exitoso', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar nuevo usuario',
        security: [],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
        },
        responses: {
          '201': { description: 'Usuario registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          '400': { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/auth/perfil': {
      get: {
        tags: ['Auth'],
        summary: 'Obtener perfil del usuario autenticado',
        responses: {
          '200': { description: 'Perfil del usuario', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/cambiar-password': {
      put: {
        tags: ['Auth'],
        summary: 'Cambiar contraseña',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } } },
        },
        responses: {
          '200': { description: 'Contraseña actualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    // ── USUARIOS ────────────────────────────────────────────────
    '/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Listar todos los usuarios',
        description: 'Requiere rol ADMIN o GERENTE',
        responses: {
          '200': { description: 'Lista de usuarios', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Crear usuario',
        description: 'Requiere rol ADMIN',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUsuarioRequest' } } },
        },
        responses: {
          '201': { description: 'Usuario creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/usuarios/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      get: {
        tags: ['Usuarios'],
        summary: 'Obtener usuario por ID',
        description: 'Requiere rol ADMIN o GERENTE',
        responses: {
          '200': { description: 'Usuario encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Usuarios'],
        summary: 'Actualizar usuario',
        description: 'Requiere rol ADMIN',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUsuarioRequest' } } },
        },
        responses: {
          '200': { description: 'Usuario actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Usuarios'],
        summary: 'Desactivar usuario (soft delete)',
        description: 'Requiere rol ADMIN',
        responses: {
          '200': { description: 'Usuario desactivado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── PLANES DE MEMBRESÍA ─────────────────────────────────────
    '/planes': {
      get: {
        tags: ['Planes de Membresía'],
        summary: 'Listar todos los planes',
        responses: {
          '200': { description: 'Lista de planes', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Planes de Membresía'],
        summary: 'Crear plan de membresía',
        description: 'Requiere rol ADMIN',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateMembresiaRequest' } } },
        },
        responses: {
          '201': { description: 'Plan creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/planes/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      get: {
        tags: ['Planes de Membresía'],
        summary: 'Obtener plan por ID',
        responses: {
          '200': { description: 'Plan encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Planes de Membresía'],
        summary: 'Actualizar plan',
        description: 'Requiere rol ADMIN',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateMembresiaRequest' } } },
        },
        responses: {
          '200': { description: 'Plan actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Planes de Membresía'],
        summary: 'Eliminar plan',
        description: 'Requiere rol ADMIN',
        responses: {
          '200': { description: 'Plan eliminado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── MIEMBROS ────────────────────────────────────────────────
    '/miembros': {
      get: {
        tags: ['Miembros'],
        summary: 'Listar todos los miembros',
        responses: {
          '200': { description: 'Lista de miembros', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Miembros'],
        summary: 'Crear miembro',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateMiembroRequest' } } },
        },
        responses: {
          '201': { description: 'Miembro creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/miembros/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      get: {
        tags: ['Miembros'],
        summary: 'Obtener miembro por ID',
        responses: {
          '200': { description: 'Miembro encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Miembros'],
        summary: 'Actualizar miembro',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateMiembroRequest' } } },
        },
        responses: {
          '200': { description: 'Miembro actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/miembros/{id}/verificar-acceso': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      get: {
        tags: ['Miembros'],
        summary: 'Verificar si el miembro tiene membresía activa',
        responses: {
          '200': { description: 'Resultado de verificación', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/miembros/{id}/renovar': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      post: {
        tags: ['Miembros'],
        summary: 'Renovar membresía del miembro',
        responses: {
          '200': { description: 'Membresía renovada', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── PAGOS ───────────────────────────────────────────────────
    '/pagos': {
      get: {
        tags: ['Pagos'],
        summary: 'Listar todos los pagos',
        responses: {
          '200': { description: 'Lista de pagos', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Pagos'],
        summary: 'Registrar pago',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePagoRequest' } } },
        },
        responses: {
          '201': { description: 'Pago registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/pagos/reporte': {
      get: {
        tags: ['Pagos'],
        summary: 'Reporte de pagos',
        description: 'Requiere rol ADMIN o GERENTE',
        responses: {
          '200': { description: 'Reporte de pagos', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/pagos/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      get: {
        tags: ['Pagos'],
        summary: 'Obtener pago por ID',
        responses: {
          '200': { description: 'Pago encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Pagos'],
        summary: 'Actualizar estado del pago',
        description: 'Requiere rol ADMIN o GERENTE',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdatePagoRequest' } } },
        },
        responses: {
          '200': { description: 'Pago actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── ACCESOS ─────────────────────────────────────────────────
    '/accesos': {
      get: {
        tags: ['Accesos'],
        summary: 'Listar todos los accesos',
        responses: {
          '200': { description: 'Lista de accesos', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Accesos'],
        summary: 'Registrar entrada o salida',
        description: 'Valida automáticamente si el miembro tiene membresía activa',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegistrarAccesoRequest' } } },
        },
        responses: {
          '201': { description: 'Acceso registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/accesos/miembro/{miembroId}': {
      parameters: [{ name: 'miembroId', in: 'path', required: true, schema: { type: 'integer' } }],
      get: {
        tags: ['Accesos'],
        summary: 'Historial de accesos de un miembro',
        responses: {
          '200': { description: 'Historial de accesos', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    // ── SUCURSALES ──────────────────────────────────────────────
    '/sucursales': {
      get: {
        tags: ['Sucursales'],
        summary: 'Listar todas las sucursales',
        responses: {
          '200': { description: 'Lista de sucursales', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Sucursales'],
        summary: 'Crear sucursal',
        description: 'Requiere rol ADMIN',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateSucursalRequest' } } },
        },
        responses: {
          '201': { description: 'Sucursal creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/sucursales/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      get: {
        tags: ['Sucursales'],
        summary: 'Obtener sucursal por ID',
        responses: {
          '200': { description: 'Sucursal encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Sucursales'],
        summary: 'Actualizar sucursal',
        description: 'Requiere rol ADMIN',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateSucursalRequest' } } },
        },
        responses: {
          '200': { description: 'Sucursal actualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Sucursales'],
        summary: 'Eliminar sucursal',
        description: 'Requiere rol ADMIN',
        responses: {
          '200': { description: 'Sucursal eliminada', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── INVENTARIO ──────────────────────────────────────────────
    '/inventario': {
      get: {
        tags: ['Inventario'],
        summary: 'Listar items del inventario',
        responses: {
          '200': { description: 'Lista del inventario', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Inventario'],
        summary: 'Crear item en inventario',
        description: 'Requiere rol ADMIN o GERENTE',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateInventarioRequest' } } },
        },
        responses: {
          '201': { description: 'Item creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/inventario/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      get: {
        tags: ['Inventario'],
        summary: 'Obtener item por ID',
        responses: {
          '200': { description: 'Item encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Inventario'],
        summary: 'Actualizar item',
        description: 'Requiere rol ADMIN o GERENTE',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateInventarioRequest' } } },
        },
        responses: {
          '200': { description: 'Item actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Inventario'],
        summary: 'Eliminar item',
        description: 'Requiere rol ADMIN',
        responses: {
          '200': { description: 'Item eliminado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/inventario/{id}/stock': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      patch: {
        tags: ['Inventario'],
        summary: 'Ajustar stock de un item',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AjustarStockRequest' } } },
        },
        responses: {
          '200': { description: 'Stock ajustado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
  },
};
