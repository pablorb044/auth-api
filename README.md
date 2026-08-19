# Auth API — Team Management Platform

Plataforma full-stack para la gestión interna de equipos, desarrollada con Node.js, Express, PostgreSQL, Prisma y React.

El proyecto comenzó como una API de autenticación y ha evolucionado hacia un MVP de gestión de organizaciones, equipos y empleados. La infraestructura de autenticación, persistencia y frontend existente constituye ahora la base técnica sobre la que se desarrolla el producto.

> **Objetivo principal:** construir un MVP funcional de gestión de equipos y tareas, manteniendo una arquitectura profesional y evolucionándolo progresivamente sin introducir complejidad innecesaria.

El proyecto está orientado principalmente a portfolio y aprendizaje profesional. La prioridad es demostrar capacidad para construir y evolucionar una aplicación full-stack real, prestando especial atención a arquitectura, separación de responsabilidades, autenticación, persistencia, modelado de datos, testing, seguridad y evolución progresiva del producto.

---

## 🚀 Concepto del producto

NEO es una aplicación interna sencilla para que una organización pueda crear y gestionar un equipo de trabajo.

El MVP parte de una estructura deliberadamente pequeña:

```text
Organization
    │
    └── Team
          │
          ├── Manager
          ├── User
          └── Member
```

El flujo principal consiste en:

```text
Usuario
   ↓
Registro / Login
   ↓
Crear o acceder a una Organization
   ↓
Crear Team
   ↓
Manager
   ↓
Usuarios solicitan entrar
   ↓
Manager acepta o rechaza
   ↓
Usuario entra al Team
   ↓
Manager gestiona el Team
```

El sistema está diseñado para mantener una única estructura sencilla durante el MVP.

### Alcance actual del MVP

Durante esta fase:

* Una organización tiene un Team.
* Un Team tiene un único manager.
* Un usuario pertenece como máximo a un Team.
* Un manager administra un único Team.
* Los usuarios pueden solicitar entrar en un Team.
* El manager puede aceptar o rechazar solicitudes.
* Un usuario puede abandonar un Team.
* Un manager puede expulsar miembros.
* Un manager puede renombrar y eliminar su Team.
* Un manager puede promover un usuario a `MEMBER`.
* `MEMBER` se mantiene como rango intermedio, pero sus permisos específicos se definirán más adelante.
* No se implementan jerarquías organizativas avanzadas.

La arquitectura podrá ampliarse posteriormente si el producto lo necesita.

---

## 👥 Roles

### Manager

El manager representa al responsable directo de un Team.

Actualmente puede:

* Ver su Team.
* Consultar los miembros.
* Renombrar el Team.
* Eliminar el Team.
* Gestionar solicitudes de incorporación.
* Aprobar solicitudes.
* Rechazar solicitudes.
* Promover usuarios a `MEMBER`.
* Expulsar miembros.
* Ver el estado de sus miembros.

El manager no puede:

* Abandonar su propio Team.
* Eliminarse como miembro.
* Modificar su propio rol mediante la gestión de miembros.

### User

`user` representa al usuario normal dentro del sistema y puede pertenecer a un Team.

Actualmente puede:

* Consultar su Team.
* Ver los miembros del Team.
* Solicitar entrar en un Team.
* Abandonar el Team.
* Trabajar con las funcionalidades de usuario que se incorporen posteriormente.

### MEMBER

`MEMBER` representa actualmente un rango intermedio entre `user` y `manager`.

Durante el MVP:

* Puede pertenecer a un Team.
* Puede ser promovido por un manager.
* Su diferenciación funcional respecto a `user` todavía no está definida completamente.

No se añadirá una jerarquía más compleja hasta que exista una necesidad real de producto.

---

## 🏢 Organizations y Teams

El MVP utiliza una relación sencilla:

```text
Organization
    ↓
Team
    ↓
Manager + Users/Members
```

Actualmente se puede:

* Crear una Organization junto a su Team.
* Asociar automáticamente al creador como manager.
* Consultar el Team.
* Consultar sus miembros.
* Renombrar el Team.
* Eliminar el Team.

### Delete Team

La eliminación del Team se realiza mediante una transacción.

Cuando un manager elimina un Team:

* El Team se elimina.
* Los miembros quedan sin `teamId`.
* El manager vuelve a tener rol `user`.
* Las solicitudes de incorporación asociadas al Team se eliminan.

---

## 🤝 Join Requests

La incorporación al Team utiliza un sistema basado en solicitudes.

Flujo:

```text
User
   ↓
Create Join Request
   ↓
Pending
   ↓
Manager
   ├── Approve
   └── Reject
```

El manager dispone de una página específica:

```text
/join-requests
```

donde puede consultar:

* Username del solicitante.
* Email del solicitante.
* Fecha de la solicitud.
* Estado pendiente.

### Reutilización de solicitudes

Una solicitud `approved` o `rejected` puede reutilizarse posteriormente.

Esto permite:

```text
approved
   ↓
user abandona Team
   ↓
vuelve a solicitar
   ↓
pending
```

o:

```text
rejected
   ↓
vuelve a solicitar
   ↓
pending
```

La misma solicitud se reutiliza en lugar de crear una fila duplicada.

Las solicitudes pendientes continúan siendo únicas por combinación de usuario y Team.

---

## 👥 Gestión de miembros

El manager dispone actualmente de las siguientes acciones:

### Make Member

Permite cambiar el rol de un usuario que ya pertenece al Team:

```text
user
  ↓
Make Member
  ↓
MEMBER
```

No permite modificar el rol del propio manager.

### Remove Member

Permite expulsar un miembro:

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

### Leave Team

Un usuario normal puede abandonar voluntariamente su Team:

```text
User
   ↓
Leave Team
   ↓
teamId = null
```

El manager no puede abandonar su propio Team.

---

## 📋 Sistema de tareas

El sistema de tareas será la funcionalidad principal de trabajo del MVP.

**Todavía está pendiente de implementación.**

El objetivo inicial es permitir que un manager cree tareas y las asigne a usuarios del Team.

Flujo previsto:

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

La tarea ha sido creada y asignada.

### WORKING

El usuario ha comenzado a trabajar.

### SUBMITTED

El usuario considera que ha terminado y entrega la tarea para revisión.

### DONE

El manager confirma que la tarea está completada.

Durante el MVP no se implementarán inicialmente estados adicionales como:

* `REJECTED`
* `CANCELLED`
* `BLOCKED`

La entrega podrá mantenerse inicialmente sencilla, utilizando texto y, si resulta necesario, archivos asociados.

---

## 🔐 Autenticación

La autenticación JWT constituye la infraestructura base del proyecto.

Actualmente incluye:

* Registro de usuarios.
* Login.
* Logout.
* JWT.
* Bearer Authentication.
* Persistencia de sesión.
* Rehidratación de sesión.
* Rutas protegidas.
* `/auth/me`.
* Actualización del perfil.
* Desactivación lógica de usuarios.
* Validación mediante Zod.
* Manejo de errores de Prisma.
* Tests de integración.

La infraestructura existente se mantiene y se reutiliza.

No se plantea rehacer el sistema de autenticación mientras siga siendo adecuado para el producto.

---

## 👤 Perfil

Actualmente incluye:

* Profile protegido.
* Edición de username.
* Edición de email.
* Cancelación de cambios.
* Estados de loading, error y éxito.
* Prevención de peticiones duplicadas.
* Persistencia mediante API.

La actualización se realiza mediante:

```text
PUT /auth/me
```

Flujo:

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

## 🖥️ Frontend

El frontend está construido con React + Vite.

Actualmente incluye:

* React.
* Vite.
* React Router.
* Axios.
* Context API.
* `AuthContext`.
* Hooks reutilizables.
* AppLayout.
* Sidebar.
* Header.
* Dashboard.
* Team.
* Organization.
* Join Requests.
* Settings.
* Componentes UI reutilizables.
* Dark / Light mode.
* Persistencia del tema mediante `localStorage`.
* Loading / success / error states.
* Navegación protegida.

Páginas principales actuales:

```text
/login
/register
/dashboard
/team
/organization
/join-requests
/settings
```

La página `/join-requests` está orientada al manager.

---

## 🛠️ Stack

### Backend

* Node.js
* Express
* PostgreSQL
* Prisma ORM
* Docker
* JWT
* bcrypt
* Zod

### Frontend

* React
* Vite
* React Router
* Axios
* Context API
* Tailwind CSS
* `@tailwindcss/vite`
* Lucide React

### Testing

* Vitest
* Supertest

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
│   ├── auth-API/
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

La API mantiene una arquitectura basada en capas:

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

Los controllers no acceden directamente a Prisma.

La persistencia pasa mediante los Models y Prisma ORM.

### Frontend

La arquitectura sigue:

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

Los services centralizan las peticiones HTTP.

Los hooks encapsulan lógica reutilizable.

Actualmente existen, entre otros:

* `useAuth`
* `useProfile`
* `useDashboard`

`useDashboard` gestiona los datos de Organization y Team y permite refrescar el estado después de determinadas operaciones.

---

## 🧪 Testing

Los tests de backend utilizan:

* Vitest.
* Supertest.

Actualmente existen:

```text
84 tests
```

y el bloque de Join Requests / Team management ha ampliado la suite hasta:

```text
85 tests
```

La suite cubre actualmente:

### Auth

* Registro.
* Login.
* Autenticación.
* Perfil.
* Casos límite.

### Organization

* Creación.
* Acceso.
* Validaciones.

### Team

* Obtener Team.
* Obtener miembros.
* Leave Team.
* Remove Member.
* Update Member Role.
* Rename Team.
* Delete Team.
* Permisos entre managers y miembros.
* Usuarios de otros Teams.
* Eliminación de Team y limpieza de relaciones.

### Join Requests

* Crear solicitud.
* Duplicados pendientes.
* Approve.
* Reject.
* Permisos de manager.
* Managers de otros Teams.
* Reutilización tras `approved`.
* Reutilización tras `rejected`.
* Limpieza al eliminar un Team.

El proyecto utiliza una base de datos de testing aislada para evitar que los tests modifiquen accidentalmente los datos de desarrollo.

La funcionalidad no se considera terminada únicamente porque funcione manualmente.

---

## 📡 Endpoints principales

### Auth

| Método | Endpoint         | Descripción                 |
| ------ | ---------------- | --------------------------- |
| GET    | `/ping`          | Health check                |
| POST   | `/auth/register` | Registrar usuario           |
| POST   | `/auth/login`    | Iniciar sesión              |
| GET    | `/auth/me`       | Obtener usuario autenticado |
| PUT    | `/auth/me`       | Actualizar usuario          |
| DELETE | `/auth/me`       | Desactivar usuario          |

### Organizations

| Método | Endpoint         | Descripción               |
| ------ | ---------------- | ------------------------- |
| POST   | `/organizations` | Crear Organization + Team |

### Teams

| Método | Endpoint                              | Descripción      |
| ------ | ------------------------------------- | ---------------- |
| GET    | `/teams/:teamId`                      | Obtener Team     |
| GET    | `/teams/:teamId/members`              | Obtener miembros |
| DELETE | `/teams/:teamId/members/me`           | Abandonar Team   |
| DELETE | `/teams/:teamId/members/:userId`      | Expulsar miembro |
| PATCH  | `/teams/:teamId/members/:userId/role` | Actualizar rol   |
| PATCH  | `/teams/:teamId`                      | Actualizar Team  |
| DELETE | `/teams/:teamId`                      | Eliminar Team    |

### Join Requests

| Método | Endpoint                          | Descripción                                |
| ------ | --------------------------------- | ------------------------------------------ |
| POST   | `/team-join-requests`             | Crear solicitud                            |
| GET    | `/team-join-requests`             | Obtener solicitudes pendientes del manager |
| PATCH  | `/team-join-requests/:id/approve` | Aprobar solicitud                          |
| PATCH  | `/team-join-requests/:id/reject`  | Rechazar solicitud                         |

Los endpoints de tareas todavía están pendientes de implementación.

---

## ⚙️ Instalación

El proyecto está dividido en backend y frontend.

Se deben ejecutar ambos servidores en terminales separadas.

Asegúrate de que Docker esté iniciado y PostgreSQL esté disponible antes de ejecutar el backend.

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

## 🎨 UI / UX

El frontend utiliza una interfaz SaaS moderna con:

* Dark mode como tema principal.
* Light mode alternativo.
* Tailwind CSS.
* Componentes reutilizables.
* Lucide React.
* Cards.
* Glassmorphism.
* Gradientes violet / purple.
* Variables CSS.
* Estados visuales de loading, éxito y error.
* Diseño responsive en evolución.

El tema seleccionado se guarda mediante `localStorage`.

La prioridad visual es mantener una interfaz limpia, moderna y profesional sin sacrificar funcionalidad.

---

## 🗺️ Roadmap actual

El roadmap se ha actualizado respecto al planteamiento inicial. Las fases de Organization, Team y Join Requests ya están implementadas.

### Fase 0 — Base técnica

**Completada.**

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
* Testing.
* Protección de rutas.
* Persistencia de sesión.

### Fase 1 — Organization + Team

**Completada.**

Incluye:

* Organization.
* Team.
* Manager.
* Relación usuario ↔ Team.
* Gestión básica de miembros.
* Rename Team.
* Remove Member.
* Leave Team.
* Delete Team.
* Make Member.

### Fase 2 — Join Requests

**Completada.**

Incluye:

* Crear solicitudes.
* Listar pendientes.
* Mostrar solicitante.
* Approve.
* Reject.
* Reutilización de solicitudes.
* Integración frontend + backend.

### Fase 3 — Sistema de tareas

**Siguiente gran bloque del MVP.**

Objetivos:

#### Manager

* Crear tareas.
* Asignar tareas.
* Consultar tareas.
* Revisar tareas entregadas.
* Marcar tareas como `DONE`.

#### User / Member

* Ver tareas asignadas.
* Abrir tareas.
* Empezar tareas.
* Trabajar en tareas.
* Entregar tareas.

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

### Fase 4 — Dashboard funcional

Una vez implementadas las tareas:

* Dashboard del manager.
* Dashboard del usuario.
* Tareas pendientes.
* Tareas en progreso.
* Tareas entregadas.
* Tareas completadas.
* Información útil del Team.

No se añadirán gráficos o estadísticas únicamente por motivos visuales.

### Fase 5 — QA y cierre del MVP

Antes de considerar el MVP terminado:

* Validaciones frontend.
* Validaciones backend.
* Loading states.
* Error handling.
* Casos límite.
* Tests.
* Revisión de seguridad.
* UX.
* Responsive.
* Limpieza de código.
* Revisión del modelo de datos.
* Documentación actualizada.
* Demo completa end-to-end.

### Prioridad

No se añadirán nuevas funcionalidades grandes antes de cerrar el flujo principal:

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
Usuario dentro del Team
   ↓
Manager crea tarea
   ↓
Usuario recibe tarea
   ↓
Usuario trabaja
   ↓
Usuario entrega
   ↓
Manager revisa
   ↓
DONE
```

---

## 🔮 Después del MVP

Estas funcionalidades quedan fuera del desarrollo inmediato:

### Roles y organización

* Roles adicionales.
* Permisos avanzados.
* Jerarquías organizativas complejas.
* Múltiples Teams.
* Estructuras empresariales avanzadas.

`MEMBER` se mantiene por ahora como rango intermedio disponible, pero sus permisos específicos se definirán cuando exista una necesidad real de producto.

No se implementará actualmente un rol adicional como `General Manager`.

### Comunicación

* Emails.
* Notificaciones.
* Recordatorios.

### Tareas

* Más estados.
* Fechas límite.
* Prioridades.
* Comentarios.
* Historial avanzado.
* Adjuntos avanzados.

### Seguridad

* Refresh Tokens.
* Rate Limiting.
* Mejoras adicionales.

### Documentación técnica

* Swagger / OpenAPI.

### DevOps

* CI/CD.
* Despliegue.

Estas funcionalidades solo se priorizarán después de evaluar el MVP completo.

---

## 📚 Documentación

El proyecto mantiene dos documentos principales:

### `README.md`

Documento orientado a:

* Concepto del producto.
* Funcionalidades.
* Arquitectura general.
* Instalación.
* Ejecución.
* Endpoints.
* Estado actual.
* Roadmap.

### `PROJECT_GUIDE.md`

Documento técnico orientado a:

* Contexto detallado.
* Convenciones del proyecto.
* Arquitectura.
* Decisiones técnicas.
* Estado de desarrollo.
* Próximos objetivos.
* Guía para continuar el desarrollo en futuras sesiones.

La documentación se actualiza al cerrar bloques importantes de trabajo, evitando regenerarla después de cada pequeña modificación.

---

# 🔥 Estado actual

NEO ya no es únicamente una API de autenticación.

Actualmente dispone de una base full-stack funcional que incluye:

* Autenticación JWT.
* Registro y login.
* Logout.
* Persistencia y rehidratación de sesión.
* Rutas protegidas.
* PostgreSQL.
* Prisma.
* Docker.
* Tests de integración.
* Profile.
* Settings.
* AppLayout.
* Sidebar.
* Header.
* Dark / Light mode persistente.
* Organizations.
* Teams.
* Managers.
* Users.
* `MEMBER`.
* Gestión de miembros.
* Leave Team.
* Rejoin Team.
* Rename Team.
* Make Member.
* Remove Member.
* Delete Team.
* Join Requests.
* Approve.
* Reject.
* Reutilización de solicitudes.
* Página específica de Join Requests para managers.
* Base de datos de testing aislada.
* Suite de integración con 85 tests pasando.

El proyecto se encuentra actualmente en transición hacia la siguiente gran funcionalidad del MVP:

> **Sistema de tareas y flujo completo de trabajo entre manager y usuarios.**

La prioridad sigue siendo avanzar hacia un MVP funcional, reutilizando la arquitectura existente y evitando refactorizaciones o jerarquías innecesarias.

---

**Próximo objetivo: implementar el sistema de tareas.**
