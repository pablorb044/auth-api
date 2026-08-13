# Auth API — Team Management Platform

Plataforma full-stack para la gestión interna de equipos y tareas, desarrollada con Node.js, Express, PostgreSQL, Prisma y React.

El proyecto comenzó como una API de autenticación y ha evolucionado progresivamente hacia una aplicación interna para empresas y equipos de trabajo.

La autenticación, gestión de usuarios, persistencia y estructura frontend construidas inicialmente forman ahora la base técnica sobre la que se desarrolla el producto.

> **Objetivo principal:** construir un MVP funcional de gestión de equipos y tareas, manteniendo una arquitectura profesional y evolucionándolo progresivamente.

El proyecto está orientado principalmente a portfolio y aprendizaje profesional. La prioridad es demostrar capacidad para construir y evolucionar una aplicación full-stack real, prestando especial atención a arquitectura, separación de responsabilidades, autenticación, persistencia, testing, modelado de datos y evolución progresiva del producto.

---

## 🚀 Concepto del producto

La aplicación permite a una empresa crear una cuenta y gestionar un pequeño equipo de trabajo.

El MVP se centra deliberadamente en una funcionalidad principal:

> **Un manager puede gestionar a sus empleados y asignarles tareas, mientras que los empleados pueden trabajar y entregar esas tareas para su revisión.**

La estructura inicial será sencilla para evitar convertir el proyecto en una plataforma completa de recursos humanos.

Modelo conceptual:

    Organization
        │
        └── Team
              │
              └── Manager
                    ├── Employee
                    ├── Employee
                    └── Employee

Ejemplo:

    Empresa: Carnes Paco S.L.
    Equipo: Sección de embutidos
    Manager: Pedro

    Employees:
    - Antonio
    - Carlitos
    - María

Durante el MVP:

- Una organización tendrá un equipo.
- Un equipo tendrá un único manager.
- Un manager gestionará un único equipo.
- Un employee pertenecerá a un único equipo.
- Un employee estará vinculado a un único manager.
- No se implementarán múltiples equipos por manager ni jerarquías complejas.

El modelo podrá ampliarse después del MVP si el producto lo necesita.

### Fuera del MVP

No se pretende construir una plataforma completa de recursos humanos.

Quedan deliberadamente fuera del MVP:

- Nóminas
- Contratos
- Vacaciones
- Bajas
- Fichajes
- Horarios
- Evaluaciones de empleados
- Departamentos complejos
- Jerarquías avanzadas
- Gestión documental avanzada
- Notificaciones por email
- Sistemas de comunicación complejos

Estas funcionalidades podrán estudiarse posteriormente, pero no forman parte del desarrollo inmediato.

---

## 👥 Roles

### Manager

El manager representa al responsable del equipo.

Durante el MVP podrá:

- Gestionar su equipo
- Ver sus empleados
- Consultar solicitudes de incorporación
- Aceptar solicitudes de empleados
- Rechazar solicitudes de empleados
- Crear tareas
- Asignar tareas a empleados
- Consultar el estado de las tareas
- Revisar tareas entregadas
- Marcar tareas como completadas

### Employee

El employee pertenece a un único equipo y está vinculado a un único manager.

Durante el MVP podrá:

- Solicitar unirse a una organización
- Consultar sus tareas
- Abrir una tarea
- Comenzar una tarea
- Trabajar en una tarea
- Entregar una tarea
- Consultar el estado de sus tareas

---

## 📋 Sistema de tareas

Las tareas serán la funcionalidad principal del MVP.

Un manager podrá crear una tarea y asignarla a uno de sus empleados.

Inicialmente las tareas utilizarán cuatro estados:

    SENT
      ↓
    WORKING
      ↓
    SUBMITTED
      ↓
    DONE

### SENT

La tarea ha sido creada y asignada al employee.

### WORKING

El employee ha comenzado a trabajar en la tarea.

### SUBMITTED

El employee considera que ha terminado y entrega la tarea para que el manager la revise.

### DONE

El manager ha revisado la entrega y confirma que la tarea está completada.

El flujo de aprobación será deliberadamente sencillo durante el MVP.

No se implementarán inicialmente estados adicionales como `REJECTED`, `CANCELLED`, `BLOCKED`, etc.

Si posteriormente fueran necesarios, podrán añadirse mediante una evolución del modelo.

### Entrega de tareas

El MVP podrá permitir que el employee entregue algún resultado asociado a la tarea.

Inicialmente se mantendrá este sistema lo más sencillo posible.

La posibilidad de adjuntar archivos podrá implementarse si resulta necesaria para que el flujo de trabajo sea demostrable, pero no se considera una dependencia obligatoria para comenzar el desarrollo del MVP.

---

## 🤝 Incorporación de empleados

El employee no podrá añadirse unilateralmente a cualquier organización.

Para evitar que el manager tenga que crear cuentas, códigos o invitaciones manualmente para cada empleado, el MVP utilizará un sistema basado en solicitudes.

Flujo:

    Employee
       ↓
    Solicita unirse a una organización
       ↓
    Manager consulta la solicitud
       ↓
    Manager acepta o rechaza
       ↓
    Employee queda vinculado al equipo

El sistema deberá impedir que un employee pertenezca simultáneamente a varias organizaciones o equipos durante el MVP.

### Fuera del MVP

No se implementarán inicialmente:

- Emails de invitación
- Emails de confirmación
- Notificaciones automáticas
- Códigos de invitación
- Invitaciones masivas
- Sistemas externos de identidad

La prioridad es conseguir un flujo funcional dentro de la propia aplicación.

---

## 🔐 Funcionalidades actuales

### Autenticación

La infraestructura de autenticación ya existente constituye la base técnica del producto.

Actualmente incluye:

- Registro de usuarios
- Login con JWT
- Autenticación mediante Bearer Token
- Logout
- Persistencia de sesión
- Rehidratación de sesión
- Rutas protegidas
- Consulta del usuario autenticado
- Actualización del perfil
- Desactivación lógica de usuarios
- Validación de datos con Zod
- Manejo de errores de Prisma
- Tests de integración

La autenticación JWT existente se mantiene y se reutilizará como parte de la nueva aplicación.

No se plantea sustituir la infraestructura de autenticación existente mientras siga siendo adecuada para el producto.

### Perfil

Actualmente incluye:

- Profile protegido mediante autenticación
- Edición de username y email
- Cancelación de cambios
- Prevención de peticiones duplicadas
- Estados de loading, éxito y error
- Actualización persistente mediante API

### Frontend

Actualmente incluye:

- React + Vite
- React Router
- Axios
- AuthContext
- Hooks reutilizables
- AppLayout
- Sidebar
- Header
- Componentes UI reutilizables
- Página de Settings
- Dark / Light mode
- Persistencia del tema mediante `localStorage`

### Gestión de equipos

La gestión de organizaciones, equipos, managers y employees constituye el siguiente gran bloque de desarrollo.

Actualmente esta funcionalidad todavía no está implementada.

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

### Backend

Arquitectura basada en capas:

    Routes
      ↓
    Controllers
      ↓
    Models
      ↓
    Prisma
      ↓
    PostgreSQL

Los controladores no acceden directamente a la base de datos.

Toda interacción con PostgreSQL pasa mediante los Models y Prisma ORM.

### Frontend

Arquitectura basada en componentes:

    Pages
      ↓
    Components
      ↓
    Context / Hooks
      ↓
    Services
      ↓
    Backend API

La autenticación se gestiona mediante `AuthContext`, mientras que las peticiones al backend se centralizan en `services`.

Los hooks encapsulan lógica reutilizable de la aplicación.

Actualmente existen hooks como:

- `useAuth`
- `useProfile`

`useProfile` gestiona la actualización del perfil, incluyendo estados de guardado, errores, éxito y prevención de operaciones duplicadas.

La nueva funcionalidad de equipos y tareas deberá integrarse sobre esta arquitectura existente evitando refactorizaciones innecesarias.

---

## 🔄 Flujo de actualización del perfil

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

Esta funcionalidad forma parte de la infraestructura existente y no debe rehacerse salvo que una necesidad concreta del nuevo producto lo requiera.

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

La interfaz se irá adaptando progresivamente al nuevo concepto de gestión de equipos y tareas.

La prioridad visual seguirá siendo mantener una interfaz limpia, moderna y profesional sin sacrificar funcionalidad.

---

## ⚙️ Instalación

El proyecto está dividido en backend y frontend.

Se deben ejecutar ambos servidores en terminales separadas.

Asegúrate de que Docker esté iniciado y que PostgreSQL esté disponible antes de ejecutar el backend.

### Backend

Desde la raíz del proyecto:

#### 1. Instalar dependencias

    npm install

#### 2. Configurar variables de entorno

Crear un archivo `.env`:

    PORT=3000
    JWT_SECRET=your_secret_key
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth_api"

#### 3. Levantar PostgreSQL

    docker compose up -d

#### 4. Ejecutar migraciones

    npx prisma migrate dev

#### 5. Iniciar la API

    npm run dev

Backend:

    http://localhost:3000

### Frontend

Desde la carpeta del cliente:

    cd auth-client

#### 1. Instalar dependencias

    npm install

#### 2. Iniciar React

    npm run dev

Frontend:

    http://localhost:5173

---

## 🧪 Tests

Desde la raíz del proyecto:

    npm test

Actualmente existen 10 tests de integración para comprobar el flujo principal de autenticación.

Los nuevos flujos de organizaciones, equipos, solicitudes y tareas deberán incorporar tests conforme se implementen.

La funcionalidad no se considerará terminada únicamente porque funcione manualmente.

---

## 📡 Endpoints actuales

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/ping` | Health check |
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Iniciar sesión |
| GET | `/auth/me` | Obtener usuario autenticado |
| PUT | `/auth/me` | Actualizar usuario |
| DELETE | `/auth/me` | Desactivar usuario |

Los endpoints relacionados con organizaciones, equipos, solicitudes y tareas se añadirán durante las siguientes fases del MVP.

---

# 🗺️ Roadmap

El desarrollo se divide en fases para evitar construir funcionalidades innecesarias antes de disponer de un MVP funcional.

La prioridad es reutilizar la infraestructura existente y añadir únicamente lo necesario para completar el producto.

---

## Fase 0 — Base técnica existente

Esta fase está completada.

### Backend

- Registro de usuarios
- Login mediante JWT
- Middleware de autenticación
- Consulta de usuario autenticado
- Actualización de perfil
- Desactivación lógica
- Validación con Zod
- PostgreSQL
- Prisma ORM
- Docker
- Tests de integración
- Manejo de errores

### Frontend

- React + Vite
- React Router
- Axios
- AuthContext
- Persistencia de sesión
- Rehidratación de sesión
- Rutas protegidas
- Login
- Register
- Logout
- Profile
- Edición de username y email
- Cancelación de cambios
- Prevención de peticiones duplicadas
- Estados de loading, éxito y error
- Settings
- AppLayout
- Sidebar
- Header
- Componentización inicial
- Tailwind CSS
- Lucide React
- Dark / Light mode
- Persistencia del tema

---

## Fase 1 — Modelo mínimo de organización

Construir la estructura mínima necesaria para representar una empresa y su equipo.

### Objetivos

- Crear modelo `Organization`
- Crear modelo `Team`
- Relacionar usuarios con una organización
- Crear roles `MANAGER` y `EMPLOYEE`
- Vincular un manager a un team
- Vincular employees al team
- Mantener un employee vinculado a un único manager
- Mantener un team con un único manager

Modelo conceptual:

    Organization
        ↓
    Team
        ↓
    Manager
        ↓
    Employees

Para el MVP se mantendrá una única estructura sencilla.

No se implementarán múltiples equipos por manager ni jerarquías complejas.

### Resultado esperado

Un usuario podrá representar una empresa y disponer de una estructura similar a:

    Carnes Paco S.L.
        ↓
    Sección de embutidos
        ↓
    Pedro — Manager
        ├── Antonio — Employee
        ├── Carlitos — Employee
        └── María — Employee

---

## Fase 2 — Solicitudes de incorporación

Implementar un sistema sencillo para que un employee pueda solicitar incorporarse a una organización.

### Flujo

    Employee
       ↓
    Join Request
       ↓
    Manager
       ↓
    Accept / Reject
       ↓
    Employee vinculado al Team

### Objetivos

- Employee puede solicitar unirse a una organización
- Manager puede consultar solicitudes pendientes
- Manager puede aceptar una solicitud
- Manager puede rechazar una solicitud
- El employee queda vinculado al team tras la aceptación
- Evitar que un employee se añada unilateralmente a una organización
- Evitar códigos manuales para cada empleado
- Impedir que un employee pertenezca a varios equipos durante el MVP

El sistema deberá ser sencillo y reducir el trabajo administrativo del manager.

### Fuera del MVP

- Emails
- Notificaciones automáticas
- Invitaciones masivas
- Códigos de invitación

---

## Fase 3 — Sistema de tareas

Construir la funcionalidad principal del producto.

### Manager

- Crear tareas
- Asignar tareas a empleados
- Consultar tareas de su equipo
- Consultar estado de las tareas
- Revisar tareas entregadas
- Marcar tareas como completadas

### Employee

- Consultar sus tareas
- Abrir una tarea
- Comenzar una tarea
- Trabajar en una tarea
- Entregar una tarea
- Consultar el estado de sus tareas

### Estados

    SENT
      ↓
    WORKING
      ↓
    SUBMITTED
      ↓
    DONE

El flujo permitirá que el employee realice la tarea y entregue el resultado, mientras que el manager será quien confirme que la tarea está completada.

### Entrega

La entrega de una tarea se mantendrá inicialmente sencilla.

Podrá incluir un resultado textual y, si resulta necesario para el MVP, un archivo asociado.

No se implementará inicialmente un sistema avanzado de almacenamiento documental.

---

## Fase 4 — Dashboard y gestión del equipo

Una vez funcionando el sistema de tareas, crear las interfaces necesarias para utilizar el producto de forma cómoda.

### Manager

- Dashboard
- Lista de empleados
- Solicitudes pendientes
- Tareas pendientes
- Tareas en progreso
- Tareas entregadas
- Tareas completadas
- Acceso a la gestión del equipo

### Employee

- Dashboard
- Tareas asignadas
- Tareas en progreso
- Tareas entregadas
- Tareas completadas

El dashboard deberá centrarse en información útil para el trabajo diario.

No se crearán estadísticas o gráficos únicamente por motivos visuales.

---

## Fase 5 — Revisión y cierre del MVP

El MVP se considerará completo cuando un usuario pueda recorrer de principio a fin un flujo real de trabajo.

Flujo objetivo:

    Registro
       ↓
    Login
       ↓
    Crear / acceder a organización
       ↓
    Crear equipo
       ↓
    Manager
       ↓
    Employee solicita unirse
       ↓
    Manager acepta
       ↓
    Employee queda vinculado
       ↓
    Manager crea tarea
       ↓
    Employee recibe tarea
       ↓
    Employee comienza a trabajar
       ↓
    Employee entrega
       ↓
    Manager revisa
       ↓
    Manager marca DONE

Antes de considerar el MVP terminado:

- Validaciones frontend
- Validaciones backend
- Estados de loading/error
- Manejo de casos límite
- Tests de integración de los nuevos flujos
- Revisión de seguridad
- Mejoras UX
- Responsive
- Limpieza de código
- Revisión del modelo de datos
- Actualización de documentación
- Preparación de una demo completa

No se añadirán nuevas funcionalidades grandes antes de cerrar este flujo.

---

# 🔮 Después del MVP

Estas funcionalidades quedan deliberadamente fuera del MVP y se evaluarán después de tener el producto base funcionando.

### Comunicación

- Emails
- Notificaciones
- Recordatorios de tareas

### Organización

- Múltiples equipos
- Roles adicionales
- Permisos avanzados
- Estructuras organizativas más complejas

### Tareas

- Más estados
- Fechas límite
- Prioridades
- Comentarios
- Historial de cambios
- Adjuntos avanzados

### Seguridad

- Refresh Tokens
- Rate Limiting
- Mejoras adicionales de seguridad

### Documentación técnica

- Swagger / OpenAPI

### DevOps

- CI/CD
- Despliegue

Estas funcionalidades no forman parte del desarrollo inmediato.

Solo se priorizarán después de evaluar el MVP completo.

---

## 📚 Documentación

Para conocer la arquitectura, convenciones, estado detallado y próximos objetivos del proyecto:

`PROJECT_GUIDE.md`

El `README.md` contiene principalmente:

- Concepto del producto
- Funcionalidades
- Arquitectura general
- Instalación
- Ejecución
- Endpoints
- Roadmap

El `PROJECT_GUIDE.md` contiene el contexto técnico más detallado necesario para continuar el desarrollo en futuras sesiones.

La documentación se actualizará principalmente al cerrar bloques importantes de trabajo, evitando regenerarla después de cada pequeña modificación.

---

## 🔥 Estado actual

El proyecto dispone actualmente de una base técnica de autenticación funcional.

Actualmente incluye:

- Autenticación JWT
- Registro y login
- Logout
- Persistencia de sesión
- Rehidratación de sesión
- Rutas protegidas
- PostgreSQL
- Prisma
- Docker
- Tests de integración
- Profile protegido
- Edición de username y email
- Actualización persistente mediante API
- Settings
- AppLayout
- Sidebar
- Header
- Sistema Dark / Light persistente
- Componentes UI reutilizables
- Hooks para encapsular lógica de aplicación

La aplicación se encuentra actualmente en transición desde un proyecto centrado exclusivamente en autenticación hacia una plataforma interna sencilla de gestión de equipos y tareas.

La infraestructura existente se considera parte del producto y deberá reutilizarse siempre que sea adecuada.

No se pretende rehacer la autenticación, frontend o arquitectura existentes sin una necesidad técnica real.

### Próximo objetivo

**Construir el modelo mínimo de organización, equipo, manager y employee, integrándolo con la infraestructura existente sin realizar refactorizaciones innecesarias.**