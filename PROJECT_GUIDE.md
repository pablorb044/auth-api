# PROJECT GUIDE — Team Management Platform

## 1. Proyecto

### Nombre

Team Management Platform

### Origen

Auth API

### Tipo de proyecto

Aplicación full-stack para la gestión interna de equipos y tareas.

### Estado

En desarrollo — MVP

### Evolución del proyecto

El proyecto comenzó como una API de autenticación cuyo objetivo inicial era construir una base técnica sólida de autenticación, persistencia y gestión de usuarios.

Durante su desarrollo se ha ampliado progresivamente hasta convertirse en una aplicación interna para empresas y equipos de trabajo.

La infraestructura construida inicialmente no se considera código descartable. La autenticación, persistencia, arquitectura backend, estructura frontend, sistema de perfiles y componentes reutilizables forman actualmente la base técnica del producto.

La nueva dirección del proyecto consiste en reutilizar esa infraestructura y construir sobre ella una plataforma sencilla de gestión de equipos y tareas.

### Objetivo del producto

Construir un MVP funcional en el que una empresa pueda gestionar un pequeño equipo de trabajo y en el que un manager pueda asignar tareas a sus empleados, mientras estos pueden trabajar y entregar dichas tareas para su revisión.

El producto debe mantenerse deliberadamente sencillo.

No se pretende construir una plataforma completa de recursos humanos.

### Objetivo de portfolio

El objetivo principal del proyecto es demostrar capacidad para construir y evolucionar una aplicación full-stack real.

La prioridad es demostrar:

- Arquitectura backend y frontend
- Autenticación
- Persistencia de datos
- Modelado de relaciones
- API REST
- Separación de responsabilidades
- Gestión de estado
- Testing
- Diseño de interfaz
- Evolución progresiva de producto
- Capacidad para trabajar sobre una base de código existente

El objetivo no es conseguir usuarios, clientes ni monetizar la aplicación.

---

## 2. Concepto del producto

La aplicación permite a una empresa crear una cuenta y gestionar un pequeño equipo de trabajo.

El MVP se centra en una funcionalidad principal:

> Un manager puede gestionar a sus empleados y asignarles tareas, mientras que los empleados pueden trabajar y entregar esas tareas para su revisión.

La estructura inicial será deliberadamente sencilla.

### Modelo conceptual

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

### Restricciones del MVP

Durante el MVP:

- Una organización tendrá un equipo.
- Un equipo tendrá un único manager.
- Un manager gestionará un único equipo.
- Un employee pertenecerá a un único equipo.
- Un employee estará vinculado a un único manager.
- Un manager podrá tener varios employees.
- Un manager podrá crear varias tareas.
- Un employee podrá recibir varias tareas.
- No se implementarán múltiples equipos por manager.
- No se implementarán jerarquías organizativas complejas.

Estas restricciones existen para mantener el dominio sencillo y evitar construir una plataforma de RRHH innecesariamente grande.

El modelo podrá ampliarse después del MVP si existe una necesidad real.

---

## 3. Roles

### Manager

El manager representa al responsable de un equipo.

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

## 4. Sistema de incorporación de empleados

El employee no podrá añadirse unilateralmente a cualquier organización.

El MVP utilizará un sistema basado en solicitudes para reducir el trabajo administrativo del manager.

### Flujo

    Employee
       ↓
    Solicita unirse a una organización
       ↓
    Manager consulta la solicitud
       ↓
    Manager acepta o rechaza
       ↓
    Employee queda vinculado al Team

### Objetivos

- El employee puede solicitar unirse a una organización.
- El manager puede consultar solicitudes pendientes.
- El manager puede aceptar una solicitud.
- El manager puede rechazar una solicitud.
- Tras la aceptación, el employee queda vinculado al team.
- El employee no puede añadirse unilateralmente a una organización.
- El sistema evita que un employee pertenezca simultáneamente a varios equipos durante el MVP.
- El sistema evita códigos manuales para cada empleado.

La prioridad es que el flujo sea sencillo y que un manager con varios empleados no tenga que realizar trabajo administrativo innecesario.

### Fuera del MVP

No se implementarán inicialmente:

- Emails de invitación
- Emails de confirmación
- Notificaciones automáticas
- Invitaciones masivas
- Códigos de invitación
- Integraciones con servicios externos de identidad

Estas funcionalidades podrán evaluarse después del MVP.

---

## 5. Sistema de tareas

Las tareas constituyen la funcionalidad principal del producto.

Un manager podrá crear una tarea y asignarla a uno de sus empleados.

Un employee podrá trabajar en la tarea y entregarla para revisión.

El manager será responsable de confirmar que la tarea está completada.

### Estados

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

El flujo de estados será deliberadamente sencillo durante el MVP.

No se implementarán inicialmente estados adicionales como:

- REJECTED
- CANCELLED
- BLOCKED
- PAUSED

Si posteriormente fueran necesarios, se evaluará una evolución del modelo.

### Entrega de tareas

La entrega debe mantenerse sencilla inicialmente.

Podrá incluir:

- Resultado textual
- Archivo asociado si resulta necesario

El sistema de archivos no constituye una dependencia obligatoria para comenzar el MVP.

No se implementará inicialmente una plataforma avanzada de gestión documental.

---

## 6. Funcionalidades existentes

La infraestructura de autenticación ya está implementada y debe reutilizarse.

### Autenticación

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

La autenticación JWT existente se mantiene.

No se sustituirá la infraestructura actual salvo que aparezca una necesidad técnica real.

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
- Persistencia del tema mediante localStorage

### Gestión de equipos

La funcionalidad de organizaciones, equipos, managers, employees, solicitudes y tareas todavía no está implementada.

Constituye el siguiente bloque principal de desarrollo.

---

## 7. Stack tecnológico

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
- @tailwindcss/vite
- Lucide React

### Testing

- Vitest
- Supertest

---

## 8. Arquitectura backend

La arquitectura backend utiliza separación por capas:

    Routes
      ↓
    Controllers
      ↓
    Models
      ↓
    Prisma
      ↓
    PostgreSQL

Los Controllers no acceden directamente a Prisma.

Toda interacción con PostgreSQL debe pasar por los Models mediante Prisma.

### Responsabilidades

#### Routes

Definen los endpoints disponibles y conectan las rutas con los Controllers.

#### Controllers

Gestionan las peticiones HTTP, validan el flujo de entrada y coordinan la lógica necesaria.

No deben contener acceso directo a Prisma.

#### Models

Centralizan la interacción con los datos y Prisma.

#### Schemas

Contienen las validaciones de entrada mediante Zod.

#### Middleware

Contiene lógica transversal como autenticación y otras validaciones de petición.

#### Lib

Contiene configuraciones y utilidades relacionadas con librerías externas.

#### Utils

Contiene funciones auxiliares reutilizables.

---

## 9. Arquitectura frontend

El frontend sigue una separación basada en componentes, páginas, estado y servicios.

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

La autenticación global se gestiona mediante AuthContext.

Los hooks encapsulan lógica reutilizable.

La comunicación HTTP se centraliza en services.

### Hooks actuales

#### useAuth

Gestiona:

- Usuario autenticado
- Token
- Estado de sesión
- Login
- Logout
- Rehidratación de sesión

#### useProfile

Gestiona:

- Actualización del perfil
- Estado de guardado
- Estados de error y éxito
- Prevención de operaciones duplicadas
- Actualización del usuario almacenado en AuthContext

La nueva funcionalidad de equipos y tareas deberá integrarse sobre esta arquitectura siempre que sea adecuada.

No se realizarán refactorizaciones globales únicamente para adaptar la arquitectura al nuevo producto.

---

## 10. Flujo de actualización del perfil

El flujo actual es:

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

El frontend evita iniciar una segunda actualización mientras existe una petición en curso.

Si la petición falla, el usuario permanece en el modo de edición y se muestra el error correspondiente.

Esta funcionalidad forma parte de la infraestructura existente y no debe rehacerse salvo que aparezca una necesidad técnica concreta.

---

## 11. Estructura del proyecto

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
    ├── PROJECT_GUIDE.md
    └── .env

### Frontend — responsabilidades principales

#### components/

Componentes reutilizables de interfaz y layout.

Actualmente contiene componentes relacionados con:

- Auth
- Layout
- Profile
- UI

Las nuevas interfaces de equipos y tareas deberán seguir la misma filosofía de componentización.

#### pages/

Páginas principales actuales:

- Login
- Register
- Profile
- Settings

Durante el desarrollo del MVP se añadirán las páginas necesarias para:

- Dashboard
- Team
- Tasks
- Join Requests

Las nuevas páginas se añadirán únicamente cuando exista una necesidad funcional real.

#### context/

Estado global de autenticación mediante AuthContext.

#### hooks/

Hooks reutilizables para encapsular lógica de aplicación.

Actualmente:

- useAuth
- useProfile

#### services/

Comunicación con la API mediante Axios.

Las peticiones relacionadas con autenticación y perfil se centralizan actualmente en auth.api.js.

Los futuros servicios relacionados con organizaciones, equipos y tareas deberán mantenerse separados por responsabilidad.

#### utils/

Funciones auxiliares relacionadas con el frontend.

---

## 12. Base de datos

### Motor

PostgreSQL

### ORM

Prisma

### Modelo actual

El modelo principal existente es:

User

Campos principales:

- id
- username
- email
- passwordHash
- role
- createdAt
- updatedAt
- isActive

El campo passwordHash nunca debe devolverse al frontend.

### Evolución prevista del modelo

El siguiente bloque de desarrollo requerirá ampliar progresivamente el modelo para representar:

- Organization
- Team
- User / Role
- Join Request
- Task

La estructura exacta deberá definirse antes de implementar las migraciones.

No se deben crear tablas o relaciones que no sean necesarias para el MVP.

### Principio de modelado

La base de datos debe representar el dominio mínimo necesario.

Evitar:

- Relaciones innecesarias
- Roles excesivamente complejos
- Jerarquías futuras prematuras
- Campos que no tengan una utilidad clara
- Funcionalidades especulativas

---

## 13. Flujo de autenticación

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

La autenticación existente se considera infraestructura estable del proyecto.

---

## 14. Sistema visual

La aplicación utiliza actualmente una interfaz SaaS moderna.

Características:

- Dark mode como tema principal
- Light mode alternativo
- Fondos dark purple / black
- Cards con glassmorphism
- Gradientes violet / purple
- Lucide Icons
- Tailwind CSS
- Variables CSS para colores
- Estados visuales de loading, éxito y error
- Diseño responsive en evolución

El tema seleccionado se almacena mediante localStorage.

La interfaz se adaptará progresivamente al nuevo concepto de gestión de equipos y tareas.

La prioridad visual es mantener una interfaz:

- Limpia
- Moderna
- Profesional
- Comprensible
- Funcional

No se deben añadir elementos visuales únicamente por decoración.

---

## 15. Convenciones técnicas

Se siguen las siguientes reglas:

- Controllers sin acceso directo a Prisma.
- Toda consulta pasa por Models.
- Nunca devolver passwordHash.
- Validar entradas con Zod.
- JWT obligatorio en rutas protegidas.
- Utilizar componentes reutilizables en frontend.
- Separar lógica de negocio, UI y comunicación con la API.
- Centralizar peticiones HTTP en services.
- Encapsular lógica reutilizable en hooks.
- Evitar duplicar lógica.
- Mantener responsabilidades claras.
- No considerar una funcionalidad terminada hasta haberla comprobado.
- Mantener commits relativamente pequeños y coherentes.
- Actualizar documentación al cerrar bloques importantes.
- Mantener la infraestructura existente siempre que sea adecuada.

### Regla importante de evolución

No rehacer código existente sin una necesidad técnica real.

Antes de modificar o sustituir una parte existente del sistema debe comprobarse si puede reutilizarse.

El objetivo es evolucionar la aplicación, no reconstruirla desde cero.

La nueva funcionalidad debe integrarse sobre la infraestructura existente siempre que sea posible.

---

## 16. Principios de desarrollo del MVP

El MVP debe mantenerse pequeño.

### Prioridad

1. Funcionalidad
2. Corrección
3. Arquitectura
4. Persistencia
5. Seguridad
6. Testing
7. UX
8. Estética

La aplicación debe poder completar un flujo real antes de añadir funcionalidades secundarias.

### Evitar scope creep

No implementar inicialmente:

- Nóminas
- Contratos
- Vacaciones
- Bajas
- Fichajes
- Horarios
- Evaluaciones
- Departamentos complejos
- Jerarquías avanzadas
- Chat
- Notificaciones complejas
- Sistemas avanzados de documentos
- Analítica innecesaria

Si una funcionalidad no es necesaria para completar el flujo principal del MVP, debe quedar fuera hasta después del MVP.

---

# 17. Roadmap definitivo

## Fase 0 — Base técnica existente

Estado: COMPLETADA

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
- Protected Routes
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

Estado: PENDIENTE

Objetivo:

Crear la estructura mínima necesaria para representar una empresa y su equipo.

### Backend

Implementar los modelos y relaciones mínimas necesarias para:

- Organization
- Team
- Roles
- Relaciones entre User, Organization y Team

La estructura debe permitir:

    Organization
        ↓
    Team
        ↓
    Manager
        ↓
    Employees

### Reglas

- Una Organization tendrá un Team durante el MVP.
- Un Team tendrá un único Manager.
- Un Manager tendrá un único Team.
- Un Manager podrá tener varios Employees.
- Un Employee pertenecerá a un único Team.
- Un Employee tendrá un único Manager.

### Frontend

Crear únicamente las interfaces necesarias para:

- Crear una organización
- Acceder a la organización
- Visualizar el equipo
- Visualizar el manager
- Visualizar los employees

No implementar todavía funcionalidades avanzadas de gestión.

### Resultado esperado

Debe ser posible representar dentro de la aplicación:

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

Estado: PENDIENTE

Objetivo:

Permitir que los employees soliciten unirse a una organización sin obligar al manager a crear códigos o invitaciones manualmente.

### Backend

Implementar:

- Join Request
- Estado de solicitud
- Creación de solicitud
- Consulta de solicitudes
- Aceptación
- Rechazo
- Validaciones de pertenencia

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

### Reglas

- Un employee no puede pertenecer a varios equipos durante el MVP.
- Un employee no puede añadirse unilateralmente a una organización.
- El manager debe aprobar la solicitud.
- Una solicitud aceptada debe producir la vinculación correspondiente.
- Una solicitud rechazada no debe producir ninguna vinculación.
- El sistema debe impedir estados inconsistentes.

### Frontend

Añadir:

- Búsqueda o selección de organización
- Envío de solicitud
- Estado de solicitud
- Vista de solicitudes pendientes para el manager
- Aceptar solicitud
- Rechazar solicitud

No implementar emails.

---

## Fase 3 — Sistema de tareas

Estado: PENDIENTE

Objetivo:

Implementar la funcionalidad principal del producto.

### Backend

Crear el modelo Task y las relaciones necesarias.

Una tarea deberá poder representar como mínimo:

- Manager creador
- Employee asignado
- Título
- Descripción
- Estado
- Fechas necesarias
- Resultado o entrega si se implementa

### Manager

Debe poder:

- Crear tareas
- Asignar tareas
- Consultar tareas
- Consultar estado
- Revisar tareas entregadas
- Marcar tareas como DONE

### Employee

Debe poder:

- Consultar tareas asignadas
- Abrir tareas
- Comenzar tareas
- Entregar tareas
- Consultar estado

### Estados

    SENT
      ↓
    WORKING
      ↓
    SUBMITTED
      ↓
    DONE

El backend deberá validar las transiciones de estado.

No confiar únicamente en el frontend para controlar el flujo.

---

## Fase 4 — Dashboard y gestión del equipo

Estado: PENDIENTE

Objetivo:

Crear una interfaz cómoda para utilizar las funcionalidades implementadas.

### Manager

Dashboard con:

- Resumen del equipo
- Employees
- Solicitudes pendientes
- Tareas pendientes
- Tareas en progreso
- Tareas entregadas
- Tareas completadas

### Employee

Dashboard con:

- Tareas asignadas
- Tareas en progreso
- Tareas entregadas
- Tareas completadas

El dashboard debe mostrar información útil.

No crear estadísticas innecesarias.

---

## Fase 5 — Revisión y cierre del MVP

Estado: PENDIENTE

El MVP se considerará completo cuando pueda realizarse de principio a fin un flujo real de trabajo.

### Flujo completo

    Registro
       ↓
    Login
       ↓
    Crear Organization
       ↓
    Crear Team
       ↓
    Manager
       ↓
    Employee solicita unirse
       ↓
    Manager acepta
       ↓
    Employee queda vinculado
       ↓
    Manager crea Task
       ↓
    Employee recibe Task
       ↓
    Employee comienza a trabajar
       ↓
    Employee entrega
       ↓
    Manager revisa
       ↓
    Manager marca DONE

### Requisitos de cierre

Antes de considerar el MVP terminado:

- Validaciones frontend
- Validaciones backend
- Estados de loading
- Estados de error
- Manejo de casos límite
- Tests de integración
- Revisión de seguridad
- Revisión del modelo de datos
- Mejoras UX
- Responsive
- Limpieza de código
- Revisión de arquitectura
- Documentación actualizada
- Demo completa del flujo

No se añadirán nuevas funcionalidades grandes antes de cerrar este flujo.

---

# 18. Después del MVP

Las siguientes funcionalidades quedan fuera del MVP.

Solo se priorizarán después de comprobar que el producto base funciona correctamente.

## Comunicación

- Emails
- Notificaciones
- Recordatorios
- Avisos de cambios de estado

## Organización

- Múltiples equipos
- Roles adicionales
- Permisos avanzados
- Jerarquías
- Departamentos

## Tareas

- Más estados
- Fechas límite
- Prioridades
- Comentarios
- Historial de cambios
- Adjuntos avanzados
- Reasignación de tareas

## Seguridad

- Refresh Tokens
- Rate Limiting
- Mejoras adicionales de seguridad

Estas mejoras no deben implementarse antes de completar el MVP salvo que aparezca una necesidad técnica real.

## Documentación técnica

- Swagger / OpenAPI

## DevOps

- CI/CD
- Deploy
- Monitoring

---

# 19. Testing

El proyecto utiliza:

- Vitest
- Supertest

Actualmente existen tests de integración para el flujo principal de autenticación.

Las nuevas funcionalidades deberán incorporar tests conforme se implementen.

### Prioridad

Cada bloque funcional importante debería comprobar:

- Caso correcto
- Caso inválido
- Caso no autenticado
- Caso no autorizado
- Casos límite relevantes

No considerar una funcionalidad terminada únicamente porque funciona manualmente desde el frontend.

---

# 20. Endpoints actuales

Actualmente existen:

    GET    /ping
    POST   /auth/register
    POST   /auth/login
    GET    /auth/me
    PUT    /auth/me
    DELETE /auth/me

Los nuevos endpoints deberán añadirse progresivamente durante las fases correspondientes.

La organización recomendada será separar las responsabilidades por recurso, por ejemplo:

    /organizations
    /teams
    /join-requests
    /tasks

Los nombres y estructura exactos se decidirán durante la implementación y deberán seguir las convenciones existentes del proyecto.

---

# 21. Documentación

La documentación debe mantenerse sincronizada con el estado real del proyecto.

### README.md

Debe servir principalmente como documentación de entrada.

Debe explicar:

- Qué es el proyecto
- Qué problema resuelve
- Concepto general
- Funcionalidades
- Stack
- Arquitectura general
- Instalación
- Ejecución
- Endpoints
- Roadmap
- Estado actual

### PROJECT_GUIDE.md

Debe contener el contexto técnico necesario para continuar el desarrollo.

Debe mantenerse relativamente estable.

Debe actualizarse cuando:

- Cambie la arquitectura
- Se complete una fase
- Cambie el modelo de datos
- Se modifique una decisión importante
- Se complete un bloque significativo

No es necesario regenerar toda la documentación después de cada pequeño cambio.

---

# 22. Regla de evolución del proyecto

Este proyecto comenzó como Auth API.

La autenticación ya existente no debe considerarse una fase que haya que rehacer para adaptarse al nuevo producto.

La evolución correcta es:

    Auth API
       ↓
    Base técnica
       ↓
    Organization
       ↓
    Team
       ↓
    Manager / Employees
       ↓
    Join Requests
       ↓
    Tasks
       ↓
    Dashboard
       ↓
    MVP

La nueva funcionalidad se construirá sobre la infraestructura existente.

### Regla fundamental

> Reutilizar antes que rehacer.

Si una parte existente funciona correctamente y es compatible con el nuevo producto, se mantiene.

Solo se refactoriza o sustituye cuando exista una razón técnica concreta.

No se realizarán grandes refactorizaciones preventivas.

---

# 23. Estado actual

### Backend

Base de autenticación funcional.

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

Base funcional.

Incluye:

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
- Persistencia del tema mediante localStorage

### Producto

La infraestructura técnica está completada.

El nuevo concepto de producto está definido.

La funcionalidad de gestión de organizaciones, equipos, managers, employees, solicitudes y tareas todavía no está implementada.

### Próximo objetivo

**Construir el modelo mínimo de Organization, Team, Manager y Employee reutilizando la infraestructura existente y evitando refactorizaciones innecesarias.**

---

# 24. Comandos de desarrollo

## Backend

    npm run dev

## Frontend

    cd auth-client
    npm run dev

## Base de datos

Docker debe estar iniciado antes de ejecutar el backend.

    docker compose up -d

Migraciones:

    npx prisma migrate dev

Tests:

    npm test

---

# 25. Flujo habitual al comenzar una sesión

1. Abrir Docker.
2. Iniciar PostgreSQL.
3. Iniciar backend.
4. Iniciar frontend.
5. Comprobar el estado actual del proyecto.
6. Revisar el último checkpoint.
7. Revisar el roadmap.
8. Comprobar qué fase está activa.
9. Continuar desde el próximo objetivo.
10. Evitar implementar funcionalidades fuera de la fase actual.

---

# 26. Regla final para futuras sesiones

Antes de comenzar cualquier nueva funcionalidad:

1. Comprobar si forma parte del MVP.
2. Comprobar en qué fase del roadmap se encuentra.
3. Revisar la infraestructura existente.
4. Reutilizar código existente cuando sea adecuado.
5. Definir primero el modelo de datos necesario.
6. Implementar backend.
7. Añadir tests.
8. Integrar frontend.
9. Comprobar casos correctos y errores.
10. Actualizar documentación al cerrar el bloque.

El objetivo no es construir la aplicación más grande posible.

El objetivo es construir una aplicación pequeña pero completa, técnicamente sólida y suficientemente compleja como para demostrar capacidad profesional de desarrollo full-stack.