# Auth API

## 📖 Descripción

API REST de autenticación desarrollada con Node.js y Express.

## 🚀 Funcionalidades

- Registro de usuarios
- Login con JWT
- Middleware de autenticación
- Ruta protegida `/auth/me`

## 🛠️ Tecnologías

- Node.js
- Express
- bcrypt
- jsonwebtoken
- dotenv

## 📁 Arquitectura

src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/

## ▶️ Instalación

npm install

Crear un archivo `.env`:

PORT=3000
JWT_SECRET=super_secret_key

npm run dev

## 📡 Endpoints

GET /ping

POST /auth/register

POST /auth/login

GET /auth/me

## 🚧 Roadmap

- [x] Register
- [x] Login
- [x] JWT
- [x] Middleware
- [x] GET /auth/me
- [ ] PUT /auth/me
- [ ] DELETE /auth/me
- [ ] Zod
- [ ] Tests
- [ ] Base de datos