# Auth API

Sistema full-stack de autenticación desarrollado con Node.js, Express, PostgreSQL, Prisma y React.

El proyecto está construido como un MVP de autenticación con una arquitectura separada entre backend y frontend, y sirve como base para una futura aplicación de identidad y autenticación.

> **Objetivo principal:** conseguir un MVP funcional y evolucionarlo progresivamente.

---

## 🚀 Funcionalidades

### Backend

- Registro de usuarios
- Login con JWT
- Autenticación mediante Bearer Token
- Obtener usuario autenticado (`GET /auth/me`)
- Actualizar perfil (`PUT /auth/me`)
- Desactivar usuario (`DELETE /auth/me`)
- Validación de datos con Zod
- Persistencia de datos con PostgreSQL
- Manejo de errores de Prisma
- Tests de integración

### Frontend

- Login
- Registro
- Logout
- Persistencia de sesión mediante JWT
- Rehidratación de sesión
- Rutas protegidas
- Profile protegido mediante autenticación
- Edición de username y email
- Cancelación de cambios en el perfil
- Prevención de peticiones duplicadas
- Estados de loading, éxito y error
- Página de Settings
- AppLayout con sidebar y header
- Componentes UI reutilizables
- Dark / Light mode
- Persistencia del tema mediante `localStorage`

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
- Tailwind CSS
- `@tailwindcss/vite`
- Lucide React

### Testing

- Vitest
- Supertest

---

## 📁 Arquitectura

```text
auth-api/
│
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
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   ├── profile/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
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
Models
  ↓
Prisma
  ↓
PostgreSQL
```

Los controladores no acceden directamente a la base de datos.

Toda interacción con PostgreSQL pasa mediante los Models y Prisma ORM.

### Frontend

Arquitectura basada en componentes:

```text
Pages
  ↓
Components
  ↓
Context / Hooks
  ↓
Services
  ↓
Backend API
```

La autenticación se gestiona mediante `AuthContext`, mientras que las peticiones al backend se centralizan en `services`.

Los hooks encapsulan lógica reutilizable de la aplicación. Por ejemplo, `useProfile` gestiona la actualización del perfil, incluyendo estados de guardado, errores, éxito y prevención de operaciones duplicadas.

### Flujo de actualización del perfil

```text
Profile.jsx
    ↓
useProfile
    ↓
auth.api.js
    ↓
PUT /auth/me
    ↓
AuthController
    ↓
UserModel
    ↓
Prisma
    ↓
PostgreSQL
```

---

## 🎨 UI

El frontend utiliza una interfaz SaaS moderna con:

- Dark mode como tema principal
- Light mode alternativo
- Tailwind CSS
- Componentes reutilizables
- Lucide React para iconografía
- Cards con glassmorphism
- Gradientes violet / purple
- Variables CSS para el sistema de colores
- Estados visuales de loading, éxito y error
- Diseño responsive en evolución

El tema seleccionado se guarda mediante `localStorage` y se mantiene después de recargar la aplicación.

---

## ⚙️ Instalación

El proyecto está dividido en backend y frontend.

Se deben ejecutar ambos servidores en terminales separadas.

Asegúrate de que Docker esté iniciado y que PostgreSQL esté disponible antes de ejecutar el backend.

### Backend

Desde la raíz del proyecto:

#### 1. Instalar dependencias

```bash
npm install
```

#### 2. Configurar variables de entorno

Crear un archivo `.env`:

```env
PORT=3000
JWT_SECRET=your_secret_key
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth_api"
```

#### 3. Levantar PostgreSQL

```bash
docker compose up -d
```

#### 4. Ejecutar migraciones

```bash
npx prisma migrate dev
```

#### 5. Iniciar la API

```bash
npm run dev
```

Backend:

```text
http://localhost:3000
```

### Frontend

Desde la carpeta del cliente:

```bash
cd auth-client
```

#### 1. Instalar dependencias

```bash
npm install
```

#### 2. Iniciar React

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🧪 Tests

Desde la raíz del proyecto:

```bash
npm test
```

Actualmente existen **10 tests de integración** para comprobar el flujo principal de autenticación.

---

## 📡 Endpoints

| Método | Endpoint         | Descripción                 |
| ------ | ---------------- | --------------------------- |
| GET    | `/ping`          | Health check                |
| POST   | `/auth/register` | Registrar usuario           |
| POST   | `/auth/login`    | Iniciar sesión              |
| GET    | `/auth/me`       | Obtener usuario autenticado |
| PUT    | `/auth/me`       | Actualizar usuario          |
| DELETE | `/auth/me`       | Desactivar usuario          |

---

## 🚧 Roadmap

### Backend

- ✅ Registro de usuarios
- ✅ Login mediante JWT
- ✅ Middleware de autenticación
- ✅ Consulta de usuario autenticado
- ✅ Actualización de perfil
- ✅ Desactivación lógica
- ✅ Validación con Zod
- ✅ Tests de integración
- ✅ PostgreSQL
- ✅ Prisma ORM
- ⬜ Refresh Tokens
- ⬜ Roles y permisos
- ⬜ Rate Limiting
- ⬜ Swagger / OpenAPI

### Frontend

- ✅ React + Vite
- ✅ React Router
- ✅ Axios
- ✅ Login
- ✅ Registro
- ✅ Logout
- ✅ AuthContext
- ✅ Persistencia de sesión
- ✅ Rehidratación de sesión
- ✅ Rutas protegidas
- ✅ Profile
- ✅ Edición de username y email
- ✅ Cancelación de cambios
- ✅ Prevención de peticiones duplicadas
- ✅ Estados de loading, éxito y error
- ✅ Settings
- ✅ AppLayout
- ✅ Componentización inicial
- ✅ Tailwind CSS
- ✅ Lucide React
- ✅ Dark / Light mode
- ⬜ Mejorar navegación y routing
- ⬜ Validaciones frontend
- ⬜ Mejoras UX
- ⬜ Responsive completo
- ⬜ Dashboard principal
- ⬜ Funcionalidades de identidad/verificación

### DevOps

- ✅ Docker para PostgreSQL
- ✅ Variables de entorno
- ⬜ CI/CD
- ⬜ Despliegue

---

## 📚 Documentación

Para conocer la arquitectura, convenciones, estado detallado y próximos objetivos del proyecto:

**→** `PROJECT_GUIDE.md`

El `README.md` contiene principalmente información de instalación, ejecución, arquitectura general y funcionalidades.

El `PROJECT_GUIDE.md` contiene el contexto técnico más detallado para continuar el desarrollo en futuras sesiones.

---

## 🔥 Estado actual

**MVP de autenticación funcional.**

Backend operativo y frontend React estructurado con:

- Autenticación JWT
- Persistencia y rehidratación de sesión
- Rutas protegidas
- Profile protegido
- Edición de username y email
- Actualización persistente mediante API
- Estados de loading, éxito y error
- Settings
- AppLayout
- Sistema Dark / Light persistente
- Componentes UI reutilizables
- Hooks para encapsular lógica de aplicación

El siguiente objetivo es reforzar la navegación del frontend y continuar ampliando las funcionalidades principales del MVP.