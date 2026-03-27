# 🔌 DomiGym Backend - Documentación Técnica

## 📋 Índice

1. [Instalación](#instalación)
2. [Estructu del Proyecto](#estructura-del-proyecto)
3. [Configuración](#configuración)
4. [Módulos Implementados](#módulos-implementados)
5. [API Endpoints](#api-endpoints)
6. [Base de Datos](#base-de-datos)
7. [Autenticación](#autenticación)
8. [Testing](#testing)
9. [Deployment](#deployment)

---

## 🚀 Instalación

### Requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14 (o Docker)

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de ambiente
cp .env.example .env
# Editar .env con tus valores

# 3. Ejecutar migraciones
npm run prisma:migrate

# 4. (Opcional) Cargar datos de prueba
npm run prisma:seed

# 5. Iniciar servidor
npm run dev
```

**El servidor estará disponible en:** `http://localhost:3001`

---

## 📁 Estructura del Proyecto

```
src/
├── app.ts                          # Configuración Express
├── server.ts                       # Punto de entrada
│
├── config/                         # Configuración
│   ├── env.ts                      # Variables de ambiente
│   ├── logger.ts                   # Sistema de logs
│   └── swagger.ts                  # Configuración Swagger
│
├── lib/                            # Utilidades
│   ├── prisma.ts                   # Cliente Prisma
│   └── __tests__/utils.test.ts
│
├── middlewares/                    # Middlewares Express
│   ├── auth.middleware.ts          # Validación JWT
│   ├── error.middleware.ts         # Manejo de errores
│   ├── role.middleware.ts          # Control de roles
│   ├── validate.middleware.ts      # Validación Zod
│   ├── request-logger.middleware.ts
│   └── __tests__/
│
├── modules/                        # Módulos de negocio
│   ├── auth/                       # ✅ Autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.schema.ts
│   │   └── __tests__/
│   │
│   ├── usuarios/                   # ✅ Gestión de usuarios
│   │   ├── usuario.controller.ts
│   │   ├── usuario.service.ts
│   │   ├── usuario.routes.ts
│   │   ├── usuario.schema.ts
│   │   └── usuario.repository.ts
│   │
│   ├── membresias/                 # ✅ Membresías
│   │   ├── membresia.controller.ts
│   │   ├── membresia.service.ts
│   │   ├── membresia.routes.ts
│   │   └── __tests__/
│   │
│   ├── facturas/                   # Facturación
│   │   ├── factura.controller.ts
│   │   ├── factura.service.ts
│   │   ├── factura.pdf.ts
│   │   └── factura.routes.ts
│   │
│   ├── pagos/                      # Pagos
│   │   └── ...
│   │
│   ├── inventario/                 # Inventario
│   │   └── ...
│   │
│   ├── miembros/                   # Miembros
│   │   └── ...
│   │
│   ├── rutinas/                    # rutinas
│   │   └── ...
│   │
│   ├── dietas/                     # Dietas
│   │   └── ...
│   │
│   └── __tests__/                  # Tests de integración
│       ├── auth.integration.test.ts
│       ├── membresia.integration.test.ts
│       └── ventas.integration.test.ts
│
├── shared/                         # Utilidades compartidas
│   ├── errors.ts                   # Clases de error
│   └── response.ts                 # Formato de respuestas
│
└── logs/                           # Archivos de log

prisma/                            # Prisma ORM
├── schema.prisma                  # Definición de modelo
├── seed.ts                        # Datos iniciales
└── migrations/                    # Historial de cambios
```

---

## ⚙️ Configuración

### Variables de Ambiente (.env)

```env
# Base de Datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/domy_gym"

# Servidor
PORT=3001
NODE_ENV=development

# Autenticación JWT
JWT_SECRET=tu_clave_super_secreta_muy_larga_aqui
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Logs
LOG_LEVEL=debug
LOG_MAX_FILES=14d
```

### Configuración Prisma

Editar `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

---

## ✅ Módulos Implementados

### 1. 🔐 Auth Module

**Archivos:**
- `modules/auth/auth.controller.ts` - Controlador
- `modules/auth/auth.service.ts` - Lógica de negocio
- `modules/auth/auth.routes.ts` - Rutas
- `modules/auth/auth.schema.ts` - Validaciones

**Endpoints:**

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/refresh` | Refrescar token |
| POST | `/api/auth/logout` | Cerrar sesión |
| POST | `/api/auth/change-password` | Cambiar contraseña |

**Ejemplo de uso:**

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@gym.com",
    "contrasena": "Password123"
  }'

# Respuesta exitosa
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "uuid",
    "email": "usuario@gym.com",
    "rol": "admin"
  }
}
```

---

### 2. 👥 Usuarios Module

**Archivos:**
- `modules/usuarios/usuario.controller.ts`
- `modules/usuarios/usuario.service.ts`
- `modules/usuarios/usuario.repository.ts`

**Endpoints:**

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/api/usuarios` | Listar usuarios | ✅ admin |
| GET | `/api/usuarios/{id}` | Obtener usuario | ✅ usuario |
| POST | `/api/usuarios` | Crear usuario | ✅ admin |
| PUT | `/api/usuarios/{id}` | Actualizar usuario | ✅ admin |
| DELETE | `/api/usuarios/{id}` | Eliminar usuario | ✅ admin |

**Ejemplo:**

```bash
# Obtener todos los usuarios (requiere token admin)
curl -X GET http://localhost:3001/api/usuarios \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 3. 💳 Membresías Module

**Archivos:**
- `modules/membresias/membresia.controller.ts`
- `modules/membresias/membresia.service.ts`
- `modules/membresias/membresia.routes.ts`

**Endpoints:**

| Méto | Endpoint | Descripción |
|---|---|---|
| GET | `/api/membresias` | Listar planes |
| POST | `/api/membresias` | Crear plan |
| POST | `/api/miembros/{id}/membresia` | Asignar membresía |
| GET | `/api/miembros/{id}/membresia` | Obtener membresía |

---

## 🗄️ Base de Datos

### Entidades Principales

#### Usuario
```prisma
model Usuario {
  id           String    @id @default(cuid())
  email        String    @unique
  nombre       String
  contrasena   String
  rol          Rol       @default(USUARIO)
  estado       Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  miembro      Miembro?
}

enum Rol {
  ADMIN
  USUARIO
  MIEMBRO
}
```

#### Miembro
```prisma
model Miembro {
  id              String    @id @default(cuid())
  usuarioId       String    @unique
  usuario         Usuario   @relation(fields: [usuarioId], references: [id])
  telefono        String?
  fecha_inscripcion DateTime @default(now())
  estado          Boolean   @default(true)
  
  membresias      MiembroMembresia[]
  ventas          Venta[]
}
```

#### Membresía
```prisma
model Membresia {
  id              String    @id @default(cuid())
  nombre          String
  precio          Int       // en centavos
  duracion_dias   Int
  descripcion     String?
  estado          Boolean   @default(true)
  createdAt       DateTime  @default(now())
  
  miembros        MiembroMembresia[]
}

model MiembroMembresia {
  miembroId       String
  membresiaId     String
  fecha_inicio    DateTime
  fecha_fin       DateTime
  estado          String    @default("activa")
  
  miembro         Miembro   @relation(fields: [miembroId], references: [id])
  membresia       Membresia @relation(fields: [membresiaId], references: [id])
  
  @@id([miembroId, membresiaId])
}
```

### Comandos Útiles

```bash
# Ver estado de BD
npm run prisma:studio

# Crear migración
npm run prisma:migrate create

# Ejecutar migraciones pendientes
npm run prisma:migrate deploy

# Rescan BD
npm run prisma:generate

# Reset completo (CUIDADO! Borra todo)
npm run prisma:migrate reset
```

---

## 🔐 Autenticación

### JWT (JSON Web Tokens)

El token JWT contiene:

```json
{
  "userId": "uuid",
  "rol": "admin",
  "iat": 1709769600,
  "exp": 1709856000
}
```

### Middleware de Autenticación

```typescript
// Proteger ruta
app.get('/api/usuarios', authenticateJWT, usuarioController.list);

// Con validación de rol
app.post('/api/usuarios', 
  authenticateJWT, 
  authorize('admin'),
  usuarioController.create
);
```

### Flujo de Login

1. Usuario envía email + contraseña
2. Server valida en BD
3. Server genera JWT
4. Cliente almacena token en localStorage
5. Cliente envía token en headers: `Authorization: Bearer <token>`
6. Server verifica token y ejecuta acción

---

## 🧪 Testing

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm run test

# Solo unitarias
npm run test:unit

# Con cobertura
npm run test:coverage

# Modo watch
npm run test:watch
```

### Estructura de Tests

```
src/
├── modules/
│   ├── auth/__tests__/
│   │   └── auth.service.test.ts      (10 tests)
│   ├── membresias/__tests__/
│   │   └── membresia.service.test.ts (7 tests)
│   └── ...
├── middlewares/__tests__/
│   └── role.middleware.test.ts       (9 tests)
├── lib/__tests__/
│   └── utils.test.ts                 (12 tests)
└── __tests__/
    ├── auth.integration.test.ts      (7 tests)
    ├── membresia.integration.test.ts (6 tests)
    └── ventas.integration.test.ts    (7 tests)
```

### Escribir un Test

```typescript
describe('Auth Service', () => {
  test('Debe validar email correcto', () => {
    const email = 'usuario@gym.com';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(regex.test(email)).toBe(true);
  });
});
```

---

## 🐳 Deployment

### Docker

```bash
# Construir imagen
docker build -t domigym-backend:1.0 .

# Ejecutar contenedor
docker run -d \
  -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  --name domigym-backend \
  domigym-backend:1.0
```

### Docker Compose

```bash
# Desde raíz del proyecto
docker-compose up -d backend
```

### Scripts de Build

```bash
# Compilar TypeScript
npm run build

# Iniciar desde build compilado
npm start
```

---

## 📊 Scripts Disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Iniciar en desarrollo (con auto-reload) |
| `npm run build` | Compilar TypeScript a JavaScript |
| `npm start` | Ejecutar servidor compilado |
| `npm run test` | Ejecutar todas las pruebas |
| `npm run test:coverage` | Pruebas con cobertura |
| `npm run prisma:migrate` | Ejecutar migraciones |
| `npm run prisma:studio` | Abrir GUI de BD |
| `npm run prisma:seed` | Cargar datos iniciales |

---

## 🔗 Referencias Útiles

- [Documentación Prisma](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Versión:** 1.0.0  
**Última actualización:** 12 de Marzo de 2026  
**Estado:**  Listo para producción
