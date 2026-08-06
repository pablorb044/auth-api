# Auth API
![Node.js](https://img.shields.io/badge/Node.js-22-green)
![Express](https://img.shields.io/badge/Express-5-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![License](https://img.shields.io/badge/license-MIT-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)

Sistema full-stack de autenticación desarrollado con Node.js, Express, PostgreSQL, Prisma y React.

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
- Cliente frontend desarrollado con React
- Rutas protegidas mediante autenticación
- Persistencia de sesión mediante JWT
- Gestión del estado de autenticación con Context API

---

## 🛠️ Stack

### Backend

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Docker
- JWT
- bcrypt
- Zod

### Frontend

- React
- Vite
- React Router
- Axios
- Context API

### Testing

- Vitest
- Supertest

---

## 📁 Arquitectura

```text
auth-api/

├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── lib/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│
├── auth-client/
│   ├── package.json
│   └── src/
│       ├── pages/
│       ├── services/
│       ├── context/
│       ├── hooks/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── docker-compose.yml
├── package.json
├── PROJECT_GUIDE.md
└── README.md

```

### Backend

Arquitectura basada en capas:

```text
Routes
  ↓
Controllers
  ↓
Models (Prisma)
  ↓
PostgreSQL
```

Los controladores no acceden directamente a la base de datos.

Toda interacción con PostgreSQL pasa mediante Prisma ORM.

### Frontend

Arquitectura basada en componentes y gestión global de autenticación:

```text
Pages
  ↓
Services (Axios)
  ↓
AuthContext
  ↓
API Backend
```

La autenticación se gestiona mediante Context API, almacenando el JWT y recuperando el usuario autenticado mediante rutas protegidas.

## ⚙️ Instalación

El proyecto está dividido en backend y frontend.

Se deben ejecutar ambos servidores en terminales separadas.

Asegúrate de que el contenedor de PostgreSQL esté en ejecución antes de iniciar el backend.

---

### Backend

Desde la raíz del proyecto:

#### 1. Instalar dependencias

```bash
npm install
```

#### 2. Configurar variables de entorno

Crear un archivo `.env`

```env
PORT=3000
JWT_SECRET=your_secret_key
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth_api"
```

#### 3. Levantar PostgreSQL mediante Docker

```bash
docker compose up -d
```

#### 4. Ejecutar migraciones de Prisma

```bash
npx prisma migrate dev
```

#### 5. Iniciar la API

```bash
npm run dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

---

### Frontend

Desde la carpeta del cliente:

```bash
cd auth-client
```

#### 1. Instalar dependencias

```bash
npm install
```

#### 2. Iniciar la aplicación React

```bash
npm run dev
```

El frontend estará disponible en:

```text
http://localhost:5173
```

---

## 🧪 Ejecutar tests

Desde la raíz del proyecto:

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

### Backend

- ✅ Registro de usuarios
- ✅ Login mediante JWT
- ✅ Middleware de autenticación
- ✅ Consulta de usuario autenticado (`GET /auth/me`)
- ✅ Actualización de perfil (`PUT /auth/me`)
- ✅ Desactivación lógica de usuarios (`DELETE /auth/me`)
- ✅ Validación de datos con Zod
- ✅ Tests de integración
- ✅ Persistencia PostgreSQL
- ✅ Prisma ORM

Pendiente:

- ⬜ Refresh Tokens
- ⬜ Roles y permisos
- ⬜ Rate Limiting
- ⬜ Documentación API con Swagger/OpenAPI


### Frontend

- ✅ Configuración React + Vite
- ✅ React Router
- ✅ Cliente HTTP con Axios
- ✅ Login
- ✅ Registro de usuarios
- ✅ Logout
- ✅ AuthContext
- ✅ Persistencia de sesión mediante JWT
- ✅ Rutas protegidas
- ✅ Recuperación del usuario autenticado al cargar la aplicación

Pendiente:

- ⬜ Componentización de UI
- ⬜ Diseño y estilos
- ⬜ Validaciones frontend
- ⬜ Gestión visual de errores
- ⬜ Edición de perfil


### DevOps

- ✅ Docker para PostgreSQL
- ✅ Variables de entorno
- ⬜ CI/CD
- ⬜ Despliegue