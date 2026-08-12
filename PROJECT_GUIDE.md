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

## 2. Funcionalidades

Actualmente el proyecto permite:

- Registro de usuarios
- Inicio de sesión mediante JWT
- Persistencia de sesión
- Rehidratación de sesión
- Consulta del perfil autenticado
- Logout
- Rutas protegidas
- Actualización del perfil mediante API
- Edición de username y email desde el frontend
- Cancelación de cambios en el perfil
- Prevención de peticiones duplicadas durante la actualización
- Estados de loading, éxito y error durante la actualización
- Desactivación lógica de usuarios
- Persistencia en PostgreSQL
- Configuración básica de apariencia
- Dark / Light mode persistente

---

## 3. Stack tecnológico

### Backend

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod
- Docker

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

## 4. Arquitectura

### Backend


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


El controlador no accede directamente a la base de datos.

Toda interacción con PostgreSQL pasa por los Models mediante Prisma.

### Frontend


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


El frontend utiliza componentes reutilizables y separa la lógica de autenticación, navegación, UI y comunicación con la API.

La autenticación global se gestiona mediante `AuthContext`.

Los hooks encapsulan lógica reutilizable de la aplicación.

Actualmente existen hooks como:

- `useAuth`: gestión de autenticación, usuario, token, sesión y logout.
- `useProfile`: gestión de actualización del perfil y sus estados asociados.

`useProfile` encapsula la lógica necesaria para actualizar el perfil, incluyendo:

- Estado de guardado
- Estados de error y éxito
- Prevención de operaciones duplicadas
- Actualización del usuario almacenado en `AuthContext`

### Flujo de actualización del perfil


Profile.jsx
    ↓
useProfile
    ↓
updateProfile()
    ↓
auth.api.js
    ↓
PUT /auth/me
    ↓
authMiddleware
    ↓
AuthController.updateMe()
    ↓
updateUserSchema
    ↓
UserModel
    ↓
Prisma
    ↓
PostgreSQL


Tras una actualización correcta:


Backend
   ↓
updatedUser
   ↓
useProfile
   ↓
updateUser()
   ↓
AuthContext
   ↓
UI actualizada


La actualización se realiza mediante `PUT /auth/me`.

El frontend evita iniciar una segunda actualización mientras existe una petición en curso.

Durante la petición:


Save changes
      ↓
   Saving...
      ↓
Petición PUT
      ↓
Respuesta
      ↓
Estado normal


Si la petición falla, el usuario permanece en el modo de edición y se muestra el mensaje de error correspondiente.

---

## 5. Estructura del proyecto


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
│   │
│   └── package.json
│
├── tests/
├── docker-compose.yml
├── package.json
├── README.md
└── .env


### Frontend — responsabilidades principales

#### components/

Componentes reutilizables de interfaz y layout.

#### pages/

Páginas principales de la aplicación:

- Login
- Register
- Profile
- Settings

#### context/

Estado global de autenticación mediante `AuthContext`.

#### hooks/

Hooks reutilizables para encapsular lógica de aplicación.

Actualmente:

- `useAuth`: gestión de autenticación, usuario, token, sesión y logout.
- `useProfile`: gestión de actualización del perfil y sus estados asociados.

#### services/

Comunicación con la API mediante Axios.

Las peticiones relacionadas con autenticación y perfil se centralizan en `services/auth.api.js`.

#### utils/

Funciones auxiliares relacionadas con el frontend, como gestión del token.

---

## 6. Base de datos

Motor:

PostgreSQL

ORM:

Prisma

Modelo principal:

`User`

Campos principales:

- `id`
- `username`
- `email`
- `passwordHash`
- `role`
- `createdAt`
- `updatedAt`
- `isActive`

El campo `passwordHash` nunca se devuelve al frontend.

---

## 7. Flujo de autenticación

### Registro


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


### Login


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


### Perfil


Frontend
   ↓
GET /auth/me
   ↓
authMiddleware
   ↓
AuthController
   ↓
UserModel
   ↓
PostgreSQL


### Actualización del perfil


Profile.jsx
   ↓
useProfile
   ↓
updateProfile()
   ↓
auth.api.js
   ↓
PUT /auth/me
   ↓
authMiddleware
   ↓
AuthController.updateMe()
   ↓
updateUserSchema
   ↓
UserModel
   ↓
Prisma
   ↓
PostgreSQL


Tras una actualización correcta:


Backend
   ↓
updatedUser
   ↓
useProfile
   ↓
updateUser()
   ↓
AuthContext
   ↓
UI actualizada


La actualización del perfil es persistente en PostgreSQL. Después de guardar correctamente, el usuario puede cerrar sesión y volver a iniciar sesión manteniendo los cambios realizados.

---

## 8. Estado actual

### Backend

Funcional para el MVP actual.

Incluye:

- JWT
- Auth Middleware
- Prisma
- PostgreSQL
- Docker
- Tests
- CORS
- Manejo de errores Prisma
- Registro
- Login
- Perfil
- Actualización de usuario
- Desactivación lógica
- Validación mediante Zod

### Frontend

Base funcional del MVP.

Actualmente incluye:

- React + Vite
- React Router
- Axios
- Context API
- AuthContext
- Persistencia JWT
- Rehidratación de sesión
- Protected Routes
- Login
- Register
- Logout
- Profile
- Edición de username y email
- Cancelación de cambios
- Actualización de perfil mediante API
- Prevención de peticiones duplicadas
- Estados de loading, éxito y error
- Settings
- AppLayout
- Sidebar
- Header
- Componentes UI reutilizables
- Tailwind CSS
- Lucide React
- Dark / Light mode
- Persistencia del tema mediante `localStorage`

### Sistema visual actual

La aplicación utiliza un sistema visual oscuro basado en:

- Dark mode como tema principal
- Fondos dark purple / black
- Cards con glassmorphism
- Gradientes violet / purple
- Lucide Icons
- Tailwind CSS
- Variables CSS para colores
- Light mode alternativo basado en tonos grises
- Estados visuales de loading, éxito y error

La prioridad visual es mantener una interfaz SaaS moderna, limpia y profesional sin sacrificar funcionalidad.

---

## 9. Convenciones

Se siguen las siguientes reglas:

- Controllers sin acceso directo a Prisma.
- Toda consulta pasa por Models.
- Nunca devolver `passwordHash`.
- Validar entrada con Zod.
- JWT obligatorio en rutas protegidas.
- Utilizar componentes reutilizables en frontend.
- Separar lógica de negocio, UI y comunicación con la API.
- Centralizar las peticiones HTTP en `services`.
- Encapsular lógica reutilizable en hooks.
- No considerar una funcionalidad terminada hasta haberla comprobado.
- Mantener commits relativamente pequeños y coherentes.
- Actualizar la documentación cuando se cierre un bloque importante de trabajo.
- Evitar duplicar lógica entre componentes y hooks.

---

## 10. Roadmap

### Backend

- Refresh Tokens — opcional
- Roles y permisos
- Mejoras de seguridad
- Rate Limiting
- Swagger / OpenAPI
- Mejoras de gestión de usuarios

### Frontend

- Mejorar navegación y routing
- Validaciones frontend
- Mejoras UX
- Mejoras responsive
- Más funcionalidades de Settings
- Dashboard principal
- Funcionalidades de identidad/verificación

### Producto

- Definir funcionalidades principales del MVP
- Construir flujo completo de usuario
- Iterar sobre UI/UX después de conseguir un MVP funcional

### Deploy

- Backend → Render
- Frontend → Vercel

---

## 11. Documentación

La documentación se actualiza al cerrar bloques significativos de trabajo, no necesariamente después de cada sesión.

Cada sesión puede registrar:

- Objetivos
- Cambios realizados
- Commit
- Estado actual
- Próximo objetivo

El `PROJECT_GUIDE.md` debe mantenerse como una visión técnica relativamente estable del proyecto.

El `README.md` debe utilizarse principalmente como documentación de entrada y guía para ejecutar/utilizar el proyecto.

---

## 12. Último checkpoint

### Estado

MVP de autenticación funcional con frontend React estructurado, autenticación completa y sistema visual establecido.

### Últimos avances

- Integración de Tailwind CSS
- Integración de Lucide React
- Componentización de la UI
- Creación de AppLayout
- Sidebar y Header
- Profile protegido
- Página Settings
- Dark / Light mode
- Persistencia del tema mediante `localStorage`
- Navegación entre Profile y Settings
- Logout funcional
- Edición de username y email
- Cancelación de cambios en el perfil
- Actualización de perfil mediante `PUT /auth/me`
- Integración del endpoint de actualización con el frontend
- Creación de `useProfile`
- Estados de loading, éxito y error
- Prevención de peticiones duplicadas durante la actualización
- Actualización del usuario en `AuthContext`
- Persistencia de los cambios después de cerrar sesión y volver a iniciar sesión
- Pruebas manuales de los principales escenarios de actualización

### Pruebas realizadas

La actualización del perfil ha sido comprobada correctamente en los principales escenarios:

- Edición de username y email
- Guardado correcto
- Actualización inmediata de la UI
- Prevención de peticiones duplicadas
- Estado `Saving...` durante la petición
- Manejo de errores
- Cancelación de cambios
- Logout inmediatamente después de guardar
- Nuevo login posterior
- Comprobación de que los cambios permanecen persistidos

### Próximo objetivo

**Reforzar la navegación y el routing del frontend y continuar ampliando las funcionalidades principales del MVP de NEO.**

---

## 13. Comandos de desarrollo

### Backend


npm run dev


### Frontend


cd auth-client
npm run dev


### Base de datos

Docker debe estar iniciado antes de ejecutar el backend.


docker compose up -d


### Flujo habitual al comenzar una sesión

1. Abrir Docker
2. Iniciar backend
3. Iniciar frontend
4. Comprobar estado actual
5. Revisar último checkpoint
6. Continuar desde el próximo objetivo
