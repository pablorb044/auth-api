# Auth API
![Node.js](https://img.shields.io/badge/Node.js-22-green)
![Express](https://img.shields.io/badge/Express-5-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![License](https://img.shields.io/badge/license-MIT-blue)

REST API de autenticación desarrollada con Node.js, Express, PostgreSQL y Prisma siguiendo una arquitectura por capas y buenas prácticas de desarrollo.

---

## 🚀 Funcionalidades

- Registro de usuarios
- Login con JWT
- Autenticación mediante Bearer Token
- Obtener usuario autenticado (`GET /auth/me`)
- Actualizar perfil (`PUT /auth/me`)
- Desactivar usuario (`DELETE /auth/me`)
- Validación de datos con Zod
- Persistencia de datos con PostgreSQL
- Tests de integración con Vitest y Supertest

---

## 🛠️ Stack

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Docker
- JWT
- bcrypt
- Zod
- Vitest
- Supertest
- dotenv

---

## 📁 Arquitectura

```
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── lib/
├── utils/
└── generated/
```

```
prisma/
├── schema.prisma
└── migrations/
```

---

## ⚙️ Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear un archivo `.env`

```env
PORT=3000
JWT_SECRET=your_secret_key
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth_api"
```

### 3. Levantar PostgreSQL

```bash
docker compose up -d
```

### 4. Ejecutar migraciones

```bash
npx prisma migrate dev
```

### 5. Iniciar el servidor

```bash
npm run dev
```

---

## 🧪 Ejecutar tests

```bash
npm test
```

Actualmente existen **10 tests de integración** que verifican el flujo completo de autenticación.

---

## 📡 Endpoints

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| GET | `/ping` | Health check |
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Iniciar sesión |
| GET | `/auth/me` | Obtener usuario autenticado |
| PUT | `/auth/me` | Actualizar usuario |
| DELETE | `/auth/me` | Desactivar usuario |

---

## 🚧 Roadmap

- ✅ Register
- ✅ Login
- ✅ JWT Authentication
- ✅ Authentication Middleware
- ✅ GET /auth/me
- ✅ PUT /auth/me
- ✅ DELETE /auth/me
- ✅ Zod Validation
- ✅ Integration Tests
- ✅ PostgreSQL
- ✅ Prisma ORM
- ⬜ Refresh Tokens
- ⬜ Roles & Permissions
- ⬜ Rate Limiting
- ⬜ API Documentation (Swagger/OpenAPI)
- ⬜ CI/CD
- ⬜ Deployment