# PROJECT GUIDE — NEO Team Management Platform

## 1. Proyecto

### Nombre

**NEO — Team Management Platform**

### Origen

Auth API

### Tipo

Aplicación full-stack para gestión interna de organizaciones, equipos y tareas.

### Estado

**MVP en desarrollo**

### Evolución

El proyecto comenzó como una API de autenticación y evolucionó progresivamente hacia una aplicación interna para empresas y equipos de trabajo.

La infraestructura inicial no se considera código descartable. Autenticación, persistencia, arquitectura backend, frontend, perfiles, componentes reutilizables y testing forman la base técnica actual.

La estrategia es **reutilizar antes que rehacer**.

### Objetivo

Construir un MVP pequeño pero funcional en el que:

* Una organización tenga un Team.
* Un manager gestione ese Team.
* Los usuarios puedan incorporarse mediante solicitudes.
* El manager pueda administrar miembros.
* El manager pueda crear tareas.
* Los usuarios puedan trabajar y entregar esas tareas.
* El manager pueda revisar y completar las tareas.

No se pretende construir una plataforma completa de RRHH.

### Objetivo de portfolio

El proyecto está orientado a demostrar capacidad profesional en:

* Arquitectura backend/frontend.
* API REST.
* Autenticación y autorización.
* Persistencia y modelado relacional.
* Gestión de estado.
* Testing.
* UI/UX.
* Evolución de producto sobre una base existente.

No busca monetización ni usuarios reales.

---

# 2. Modelo actual del producto

```text
Organization
    │
    └── Team
          │
          ├── Manager
          ├── User
          └── MEMBER
```

Durante el MVP:

* Una Organization tiene un Team.
* Un Team tiene un único manager.
* Un manager gestiona un único Team.
* Un usuario pertenece como máximo a un Team.
* Un Team puede tener múltiples usuarios.
* No existen jerarquías organizativas avanzadas.
* `MEMBER` se mantiene como rango intermedio, pero sus permisos específicos quedan fuera del alcance actual.

Estas restricciones reducen la complejidad del dominio y permiten avanzar hacia el MVP rápidamente.

---

# 3. Roles

## Manager

Responsable del Team.

Actualmente puede:

* Ver el Team.
* Ver miembros.
* Renombrar el Team.
* Eliminar el Team.
* Ver Join Requests.
* Aprobar solicitudes.
* Rechazar solicitudes.
* Promover usuarios a `MEMBER`.
* Expulsar miembros.

Más adelante podrá:

* Crear y asignar tareas.
* Revisar entregas.
* Completar tareas.

El manager no puede abandonar ni eliminarse a sí mismo del Team.

## User

Usuario normal del sistema.

Actualmente puede:

* Ver su Team.
* Ver miembros.
* Solicitar entrar en un Team.
* Abandonar el Team.

Más adelante podrá trabajar con tareas.

## MEMBER

Rango intermedio entre `user` y `manager`.

Actualmente:

* Pertenece al Team.
* Puede ser promovido por un manager.
* Se conserva como concepto preparado para futuras funcionalidades.

No se implementarán todavía permisos especiales específicos para `MEMBER`.

---

# 4. Gestión de Organization y Team

La estructura actual permite:

* Crear Organization + Team.
* Asociar al creador como manager.
* Consultar el Team.
* Consultar sus miembros.
* Renombrar el Team.
* Promover miembros.
* Expulsar miembros.
* Abandonar Team.
* Eliminar Team.

### Leave Team

Un usuario normal puede abandonar un Team:

```text
User
  ↓
Leave Team
  ↓
teamId = null
```

El manager no puede abandonar su Team.

### Remove Member

El manager puede expulsar a otro miembro:

```text
Manager
  ↓
Remove
  ↓
Confirmación
  ↓
teamId = null
```

El manager no puede eliminarse a sí mismo.

### Delete Team

La eliminación se ejecuta mediante una transacción.

Al eliminar un Team:

* Se elimina el Team.
* Los miembros quedan sin Team.
* El manager vuelve a `user`.
* Las Join Requests asociadas se eliminan.

---

# 5. Join Requests

La incorporación al Team utiliza solicitudes.

```text
User
  ↓
Join Request
  ↓
Pending
  ↓
Manager
  ├── Approve
  └── Reject
```

Actualmente existe una página específica:

```text
/join-requests
```

visible para managers.

La UI muestra:

* Username.
* Email.
* Solicitudes pendientes.
* Approve.
* Reject.

### Reutilización

Una solicitud existente puede reutilizarse después de haber sido:

* `approved`
* `rejected`

Esto permite volver a solicitar acceso sin crear registros duplicados.

Ejemplo:

```text
approved
   ↓
Leave Team
   ↓
Request again
   ↓
pending
```

y:

```text
rejected
   ↓
Request again
   ↓
pending
```

---

# 6. Sistema de tareas

El sistema de tareas es la **siguiente gran funcionalidad del MVP**.

Todavía no está implementado.

Objetivo:

```text
Manager
  ↓
Create Task
  ↓
Assign
  ↓
User
  ↓
Work
  ↓
Submit
  ↓
Manager Review
  ↓
DONE
```

Estados previstos:

```text
SENT
  ↓
WORKING
  ↓
SUBMITTED
  ↓
DONE
```

### SENT

Tarea creada y asignada.

### WORKING

El usuario ha comenzado a trabajar.

### SUBMITTED

El usuario entrega el trabajo para revisión.

### DONE

El manager confirma la finalización.

No se implementarán inicialmente estados adicionales como:

* `REJECTED`
* `CANCELLED`
* `BLOCKED`
* `PAUSED`

La entrega podrá ser textual y, si resulta necesario, incluir un archivo.

---

# 7. Funcionalidades actuales

## Autenticación

La infraestructura de autenticación está completada e incluye:

* Registro.
* Login con JWT.
* Bearer Authentication.
* Logout.
* Persistencia de sesión.
* Rehidratación.
* Protected Routes.
* `/auth/me`.
* Actualización de perfil.
* Desactivación lógica.
* Zod.
* Manejo de errores Prisma.
* Tests de integración.

La autenticación existente debe reutilizarse.

## Perfil

Incluye:

* Consulta del perfil.
* Edición de username.
* Edición de email.
* Cancelación.
* Loading.
* Error.
* Success.
* Prevención de peticiones duplicadas.
* Persistencia mediante API.

## Frontend

Actualmente incluye:

* React + Vite.
* React Router.
* Axios.
* Context API.
* AuthContext.
* Hooks reutilizables.
* AppLayout.
* Sidebar.
* Header.
* Settings.
* Team.
* Join Requests.
* Organization.
* Componentes UI reutilizables.
* Dark / Light mode.
* Persistencia del tema mediante `localStorage`.

Páginas principales:

```text
/login
/register
/dashboard
/team
/organization
/join-requests
/settings
```

---

# 8. Stack

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

# 9. Arquitectura backend

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

### Routes

Definen endpoints y conectan con controllers.

### Controllers

Gestionan HTTP, validaciones de flujo, autorización y coordinación.

No acceden directamente a Prisma.

### Models

Centralizan acceso a datos mediante Prisma.

### Schemas

Validación de entrada con Zod.

### Middleware

Autenticación y lógica transversal.

### Lib

Configuraciones y utilidades de librerías externas.

### Utils

Funciones auxiliares reutilizables.

---

# 10. Arquitectura frontend

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

### Hooks actuales

#### `useAuth`

Gestiona:

* Usuario autenticado.
* Token.
* Login.
* Logout.
* Rehidratación.

#### `useProfile`

Gestiona:

* Actualización de perfil.
* Loading.
* Error.
* Success.
* Prevención de operaciones duplicadas.
* Actualización de AuthContext.

#### `useDashboard`

Gestiona:

* User.
* Team.
* Organization.
* Loading.
* Error.
* Refresco de datos.

### Services

Las peticiones HTTP se centralizan en `services`.

Actualmente existen servicios relacionados con:

* Auth.
* Organization.
* Team.
* Join Requests.

---

# 11. Flujo del perfil

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

Tras una respuesta correcta:

```text
updatedUser
  ↓
useProfile
  ↓
updateUser()
  ↓
AuthContext
  ↓
UI
```

No debe rehacerse esta infraestructura sin una necesidad técnica real.

---

# 12. Base de datos

## Motor

PostgreSQL

## ORM

Prisma

## Usuario

Campos principales:

* `id`
* `username`
* `email`
* `passwordHash`
* `role`
* `teamId`
* `createdAt`
* `updatedAt`
* `isActive`

`passwordHash` nunca debe devolverse al frontend.

## Dominio actual

El modelo ya contempla relaciones para:

* Organization.
* Team.
* User.
* Team Join Request.

El siguiente bloque añadirá:

* Task.
* Relaciones de asignación y entrega.

### Principio

La base de datos debe representar solo el dominio necesario.

Evitar:

* Relaciones innecesarias.
* Roles especulativos.
* Jerarquías futuras.
* Campos sin utilidad inmediata.

---

# 13. Estructura del proyecto

```text
auth-api/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── controllers/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── utils/
│   ├── auth-API/
│   ├── app.js
│   └── server.js
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
├── tests/
├── docker-compose.yml
├── package.json
├── README.md
├── PROJECT_GUIDE.md
└── .env
```

---

# 14. Convenciones técnicas

Reglas importantes:

* Controllers sin acceso directo a Prisma.
* Consultas de datos mediante Models.
* Nunca devolver `passwordHash`.
* Validar entradas con Zod.
* JWT en rutas protegidas.
* Services para HTTP.
* Hooks para lógica reutilizable.
* Componentes reutilizables.
* Separar UI, estado y comunicación API.
* Evitar duplicación.
* Mantener responsabilidades claras.
* Testear cada bloque importante.
* Mantener commits coherentes.
* Actualizar documentación al cerrar bloques importantes.

### Regla fundamental

> **Reutilizar antes que rehacer.**

No se realizarán grandes refactorizaciones preventivas.

---

# 15. Testing

Testing actual:

* Vitest.
* Supertest.

La suite cubre actualmente:

### Auth

* Registro.
* Login.
* Autenticación.
* Perfil.
* Casos de error.

### Organization / Team

* Creación.
* Acceso.
* Miembros.
* Leave Team.
* Remove Member.
* Roles.
* Rename Team.
* Delete Team.
* Permisos.
* Limpieza de relaciones.

### Join Requests

* Crear.
* Duplicados pendientes.
* Approve.
* Reject.
* Autorización de manager.
* Managers de otros Teams.
* Reutilización después de `approved`.
* Reutilización después de `rejected`.
* Eliminación al borrar Team.

Actualmente:

```text
85/85 tests passing
```

Los tests utilizan una base de datos aislada para evitar modificar la base de desarrollo.

### Principio

Una funcionalidad no se considera terminada solo porque funcione manualmente.

Debe comprobarse el caso correcto, errores, autenticación, autorización y casos límite relevantes.

---

# 16. UI / UX

La interfaz utiliza:

* Dark mode como principal.
* Light mode.
* Tailwind CSS.
* Glassmorphism.
* Gradientes violet/purple.
* Lucide Icons.
* Variables CSS.
* Cards.
* Estados de loading/error/success.
* Responsive en evolución.

Principio visual:

> No añadir elementos visuales solo por decoración.

La interfaz debe priorizar claridad y funcionalidad.

---

# 17. Roadmap actual

## Fase 0 — Base técnica

**COMPLETADA**

Incluye:

* Auth.
* JWT.
* PostgreSQL.
* Prisma.
* Docker.
* React.
* Router.
* AuthContext.
* Profile.
* Settings.
* UI base.
* Protected Routes.
* Testing.

## Fase 1 — Organization + Team

**COMPLETADA**

Incluye:

* Organization.
* Team.
* Manager.
* Usuarios.
* Members.
* Gestión de miembros.
* Leave Team.
* Rejoin.
* Rename.
* Make Member.
* Remove Member.
* Delete Team.

## Fase 2 — Join Requests

**COMPLETADA**

Incluye:

* Crear solicitud.
* Listar pendientes.
* Username/email del solicitante.
* Approve.
* Reject.
* Reutilización de solicitudes.

## Fase 3 — Tasks

**SIGUIENTE**

Objetivo principal del MVP.

### Backend

Crear Task y relaciones necesarias.

### Manager

* Crear.
* Asignar.
* Consultar.
* Revisar.
* Completar.

### User / Member

* Ver tareas.
* Abrir.
* Empezar.
* Trabajar.
* Entregar.

Estados:

```text
SENT
  ↓
WORKING
  ↓
SUBMITTED
  ↓
DONE
```

El backend deberá controlar las transiciones.

## Fase 4 — Dashboard funcional

**PENDIENTE**

### Manager

* Resumen del Team.
* Miembros.
* Join Requests.
* Tareas pendientes.
* Tareas en progreso.
* Tareas entregadas.
* Tareas completadas.

### User / Member

* Tareas asignadas.
* Tareas en progreso.
* Tareas entregadas.
* Tareas completadas.

No añadir estadísticas innecesarias.

## Fase 5 — Cierre MVP

**PENDIENTE**

Flujo objetivo:

```text
Registro
  ↓
Login
  ↓
Organization
  ↓
Team
  ↓
Join Request
  ↓
Approve
  ↓
User entra
  ↓
Manager crea Task
  ↓
User recibe
  ↓
User trabaja
  ↓
User entrega
  ↓
Manager revisa
  ↓
DONE
```

Antes de cerrar el MVP:

* Validaciones frontend.
* Validaciones backend.
* Loading/error states.
* Casos límite.
* Tests.
* Seguridad.
* UX.
* Responsive.
* Limpieza de código.
* Revisión del modelo.
* Documentación.
* Demo completa.

No añadir funcionalidades grandes antes de completar este flujo.

---

# 18. Fuera del MVP

No implementar todavía:

* Nóminas.
* Contratos.
* Vacaciones.
* Bajas.
* Fichajes.
* Horarios.
* Evaluaciones.
* Departamentos complejos.
* Jerarquías avanzadas.
* Chat.
* Notificaciones complejas.
* Gestión documental avanzada.
* Analítica innecesaria.
* Múltiples Teams.
* Permisos avanzados.

`MEMBER` permanece como rango intermedio disponible, pero no se desarrollará una jerarquía adicional hasta que exista una necesidad real.

---

# 19. Comandos

## Backend

```bash
npm run dev
```

## Frontend

```bash
cd auth-client
npm run dev
```

## PostgreSQL

```bash
docker compose up -d
```

## Migraciones

```bash
npx prisma migrate dev
```

## Tests

```bash
npm test
```

---

# 20. Flujo habitual de desarrollo

Al comenzar una sesión:

1. Abrir Docker.
2. Levantar PostgreSQL.
3. Iniciar backend.
4. Iniciar frontend.
5. Comprobar `git status`.
6. Revisar el último checkpoint.
7. Revisar el roadmap.
8. Identificar la fase activa.
9. Continuar desde el siguiente objetivo.

Después de cada bloque importante:

1. Implementar.
2. Testear backend.
3. Testear frontend.
4. Probar el flujo real.
5. Revisar casos límite.
6. Hacer commit coherente.
7. Actualizar documentación si corresponde.

---

# 21. Regla de evolución

La evolución del proyecto es:

```text
Auth API
  ↓
Base técnica
  ↓
Organization
  ↓
Team
  ↓
Manager / Users
  ↓
Join Requests
  ↓
Tasks
  ↓
Dashboard
  ↓
MVP
```

La autenticación existente forma parte de la infraestructura estable.

No se rehace salvo necesidad técnica real.

### Regla principal

> **Reutilizar antes que rehacer.**

El objetivo no es construir la plataforma más grande posible.

El objetivo es construir una aplicación pequeña, completa, mantenible y técnicamente sólida.

---

# 22. Estado actual

### Backend

Funcional y estable.

Incluye:

* JWT.
* Auth middleware.
* Prisma.
* PostgreSQL.
* Docker.
* CORS.
* Manejo de errores.
* Registro.
* Login.
* Perfil.
* Actualización de usuario.
* Desactivación.
* Organization.
* Team.
* Join Requests.
* Gestión de miembros.
* 85 tests pasando.

### Frontend

Funcional y estable.

Incluye:

* React + Vite.
* React Router.
* Axios.
* AuthContext.
* Protected Routes.
* Login/Register.
* Logout.
* Profile.
* Settings.
* AppLayout.
* Sidebar.
* Header.
* Organization.
* Team.
* Join Requests.
* Dark / Light mode.
* Componentes UI reutilizables.

### Producto

Organization, Team y Join Requests están implementados.

La próxima prioridad es:

> **Implementar el sistema de tareas y completar el flujo principal del MVP.**

### Próximo objetivo

**Construir Tasks sin aumentar innecesariamente la complejidad del dominio.**
