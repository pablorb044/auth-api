# PROJECT GUIDE — Auth API

## 1. Proyecto

### Nombre

Auth API

### Estado

En desarrollo — MVP

### Objetivo

Construir una aplicación de autenticación moderna con arquitectura profesional, separando claramente backend y frontend.

El proyecto sirve como portfolio y como base para futuras aplicaciones.

El objetivo principal sigue siendo:

> **Conseguir un MVP funcional y, a partir de ahí, iterar para mejorarlo.**

---

# 2. Funcionalidades

Actualmente el proyecto permite:

* Registro de usuarios
* Inicio de sesión mediante JWT
* Persistencia de sesión
* Rehidratación de sesión
* Consulta del perfil autenticado
* Logout
* Rutas protegidas
* Actualización del perfil mediante API
* Desactivación lógica de usuarios
* Persistencia en PostgreSQL
* Configuración básica de apariencia
* Dark / Light mode persistente

---

# 3. Stack tecnológico

## Backend

* Node.js
* Express
* PostgreSQL
* Prisma ORM
* JWT
* bcrypt
* Zod
* Docker

## Frontend

* React
* Vite
* React Router
* Axios
* Context API
* Tailwind CSS
* `@tailwindcss/vite`
* Lucide React

## Testing

* Vitest
* Supertest

---

# 4. Arquitectura

## Backend

```text
Frontend
   ↓
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

El controlador no accede directamente a la base de datos.

Toda interacción con PostgreSQL pasa por los Models mediante Prisma.

## Frontend

```text
App
 ↓
React Router
 ↓
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

El frontend utiliza componentes reutilizables y separa la lógica de autenticación, navegación, UI y comunicación con la API.

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
├── tests/
├── docker-compose.yml
├── package.json
├── README.md
└── .env
```

## Frontend — responsabilidades principales

### components/

Componentes reutilizables de interfaz y layout.

### pages/

Páginas principales de la aplicación:

* Login
* Register
* Profile
* Settings

### context/

Estado global de autenticación mediante `AuthContext`.

### hooks/

Hooks reutilizables como `useAuth`.

### services/

Comunicación con la API mediante Axios.

### utils/

Funciones auxiliares relacionadas con el frontend, como gestión del token.

---

# 6. Base de datos

Motor:

PostgreSQL

ORM:

Prisma

Modelo principal:

`User`

Campos principales:

* id
* username
* email
* passwordHash
* role
* createdAt
* updatedAt
* isActive

---

# 7. Flujo de autenticación

## Registro

```text
Frontend
   ↓
POST /auth/register
   ↓
Validación Zod
   ↓
Hash password
   ↓
UserModel
   ↓
Prisma
   ↓
PostgreSQL
```

## Login

```text
Frontend
   ↓
POST /auth/login
   ↓
Buscar usuario
   ↓
bcrypt.compare()
   ↓
JWT
   ↓
AuthContext
   ↓
Persistencia del token
```

## Perfil

```text
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
```

---

# 8. Estado actual

## Backend

✅ Funcional para el MVP actual.

Incluye:

* JWT
* Auth Middleware
* Prisma
* PostgreSQL
* Docker
* Tests
* CORS
* Manejo de errores Prisma
* Registro
* Login
* Perfil
* Actualización de usuario
* Desactivación lógica

## Frontend

✅ Base funcional del MVP.

Actualmente incluye:

* React + Vite
* React Router
* Axios
* Context API
* AuthContext
* Persistencia JWT
* Rehidratación de sesión
* Protected Routes
* Login
* Register
* Logout
* Profile
* Settings
* AppLayout
* Sidebar
* Header
* Componentes UI reutilizables
* Tailwind CSS
* Lucide React
* Dark / Light mode
* Persistencia del tema mediante `localStorage`

### Sistema visual actual

La aplicación utiliza un sistema visual oscuro basado en:

* Dark mode como tema principal
* Fondos dark purple / black
* Cards con glassmorphism
* Gradientes violet / purple
* Lucide Icons
* Tailwind CSS
* Variables CSS para colores
* Light mode alternativo basado en tonos grises

La prioridad visual es mantener una interfaz SaaS moderna, limpia y profesional sin sacrificar funcionalidad.

---

# 9. Convenciones

Se siguen las siguientes reglas:

* Controllers sin acceso directo a Prisma.
* Toda consulta pasa por Models.
* Nunca devolver `passwordHash`.
* Validar entrada con Zod.
* JWT obligatorio en rutas protegidas.
* Utilizar componentes reutilizables en frontend.
* Separar lógica de negocio, UI y comunicación con la API.
* No considerar una funcionalidad terminada hasta haberla comprobado.
* Mantener commits relativamente pequeños y coherentes.
* Actualizar la documentación cuando se cierre un bloque importante de trabajo.

---

# 10. Roadmap

## Backend

* Refresh Tokens — opcional
* Roles Admin
* Mejoras de seguridad
* Mejoras de gestión de usuarios

## Frontend

* Mejorar navegación y routing
* Edición de perfil
* Mejoras UX
* Validaciones visuales
* Estados de loading/error
* Mejoras responsive
* Más funcionalidades de Settings
* Dashboard principal
* Gestión de identidad/verificación

## Producto

* Definir funcionalidades principales del MVP
* Construir flujo completo de usuario
* Iterar sobre UI/UX después de conseguir un MVP funcional

## Deploy

* Backend → Render
* Frontend → Vercel

---

# 11. Documentación

La documentación se actualiza al cerrar bloques significativos de trabajo, no necesariamente después de cada sesión.

Cada sesión puede registrar:

* Objetivos
* Cambios realizados
* Commit
* Estado actual
* Próximo objetivo

El `PROJECT GUIDE` debe mantenerse como una visión técnica relativamente estable del proyecto.

El `README.md` debe utilizarse principalmente como documentación de entrada y guía para ejecutar/utilizar el proyecto.

---

# 12. Último checkpoint

### Estado

MVP de autenticación funcional con frontend React estructurado y sistema visual establecido.

### Últimos avances

* Integración de Tailwind CSS
* Integración de Lucide React
* Componentización de la UI
* Creación de AppLayout
* Sidebar y Header
* Profile protegido
* Página Settings
* Dark / Light mode
* Persistencia del tema mediante `localStorage`
* Navegación entre Profile y Settings
* Logout funcional

### Próximo objetivo

**Reforzar la navegación y el routing del frontend y comenzar a ampliar el MVP funcional de NEO.**

---

# 13. Comandos de desarrollo

## Backend

```bash
npm run dev
```

## Frontend

```bash
cd auth-client
npm run dev
```

## Base de datos

Docker debe estar iniciado antes de ejecutar el backend.

```bash
docker compose up -d
```

### Flujo habitual al comenzar una sesión

```text
1. Abrir Docker
2. Iniciar backend
3. Iniciar frontend
4. Comprobar estado actual
5. Revisar último checkpoint
6. Continuar desde el próximo objetivo
```
