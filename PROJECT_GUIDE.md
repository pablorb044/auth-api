# PROJECT GUIDE — Auth API

## 1. Proyecto

### Nombre

Auth API

### Estado

En desarrollo (MVP)

### Objetivo

Construir una API de autenticación moderna siguiendo una arquitectura similar a la utilizada en proyectos profesionales.

El proyecto servirá como portfolio y como base para futuras aplicaciones.

---

# 2. Objetivos del proyecto

La aplicación permite:

- Registro de usuarios
- Inicio de sesión mediante JWT
- Consulta del perfil autenticado
- Actualización del perfil
- Desactivación lógica de usuarios
- Persistencia en PostgreSQL

No pretende ser únicamente una práctica de Express, sino una implementación completa de un sistema de autenticación moderno.

---

# 3. Stack tecnológico

## Backend

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod
- Docker

## Frontend

- React
- Vite
- React Router
- Axios
- Context API

## Testing

- Vitest
- Supertest

---

# 4. Arquitectura

Backend

Frontend
↓
Routes
↓
Controllers
↓
Models (Prisma)
↓
PostgreSQL

El controlador nunca accede directamente a la base de datos.

Toda interacción con PostgreSQL pasa por el Model.

---

# 5. Estructura del proyecto

```text
auth-api/
├── prisma/
├── src/
│   ├── controllers/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── tests/
├── docker-compose.yml
├── package.json
├── README.md
└── .env
```

## Descripción

controllers/

Contienen la lógica de cada endpoint.

models/

Acceso a la base de datos mediante Prisma.

middleware/

Protección mediante JWT.

schemas/

Validaciones Zod.

utils/

Funciones reutilizables (JWT, sanitizeUser, etc.)

tests/

Tests de integración completos.

---

# 6. Base de datos

Motor:

PostgreSQL

ORM:

Prisma

Modelo principal:

User

Campos:

- id
- username
- email
- passwordHash
- role
- createdAt
- updatedAt
- isActive

---

# 7. Flujo de autenticación

Registro

Cliente

↓

POST /auth/register

↓

Validación Zod

↓

Hash password

↓

Prisma

↓

PostgreSQL

Login

Cliente

↓

POST /auth/login

↓

Buscar usuario

↓

bcrypt.compare()

↓

JWT

↓

Frontend guarda token

Perfil

Frontend

↓

GET /auth/me

↓

authMiddleware

↓

Controller

↓

UserModel

↓

PostgreSQL

---

# 8. Estado actual

Backend

✅ Completo para MVP

Incluye:

- JWT
- Auth Middleware
- Prisma
- PostgreSQL
- Docker
- Tests
- CORS
- Manejo de errores Prisma

Frontend

En desarrollo.

Actualmente:

- React configurado
- Axios configurado
- Login funcionando
- AuthContext iniciado

Pendiente:

- Rehidratación
- Protected Routes
- Logout
- Register
- Profile

---

# 9. Convenciones

Se siguen las siguientes reglas:

- Controllers sin acceso directo a Prisma.
- Toda consulta pasa por Models.
- Nunca devolver passwordHash.
- Validar entrada con Zod.
- JWT obligatorio en rutas protegidas.
- Tests antes de considerar una funcionalidad terminada.

---

# 10. Roadmap

Backend

- Refresh Tokens (opcional)
- Roles Admin

Frontend

- AuthContext completo
- Register
- Logout
- Persistencia de sesión
- Protected Routes

Deploy

- Render
- Vercel

---

# 11. Historial

El desarrollo del proyecto se documenta sesión a sesión mediante resúmenes técnicos.

Cada sesión incluye:

- Objetivos
- Cambios realizados
- Commits
- Estado del proyecto
- Próximos pasos

Esto permite reconstruir el contexto completo del proyecto incluso meses después.