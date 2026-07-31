import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.js'

describe('Auth API', () => {

  it('should register a new user', async () => {

    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'Pablo',
        email: 'pablo@test.com',
        password: '123456'
      })

    expect(response.status).toBe(201)
    expect(response.body.username).toBe('Pablo')
    expect(response.body.email).toBe('pablo@test.com')
  })

  it('should reject duplicated email', async () => {

  // Crear usuario
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Pablo',
      email: 'pablo@test.com',
      password: '123456'
    })

  // Intentar crearlo otra vez
  const response = await request(app)
    .post('/auth/register')
    .send({
      username: 'Otro',
      email: 'pablo@test.com',
      password: '123456'
    })

  expect(response.status).toBe(400)
  expect(response.body.error).toBe('Email already exists')

})

it('should login successfully', async () => {

  // Arrange
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Pablo',
      email: 'pablo@test.com',
      password: '123456'
    })

  // Act
  const response = await request(app)
    .post('/auth/login')
    .send({
      email: 'pablo@test.com',
      password: '123456'
    })

  // Assert
  expect(response.status).toBe(200)
  expect(response.body.token).toBeDefined()
  console.log(response.status)
  console.log(response.body)
})

it('should reject invalid credentials', async () => {

  // Arrange
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Pablo',
      email: 'pablo@test.com',
      password: '123456'
    })

  // Act
  const response = await request(app)
    .post('/auth/login')
    .send({
      email: 'pablo@test.com',
      password: '654321'
    })

  // Assert
  expect(response.status).toBe(400)
  expect(response.body.error).toBe('Invalid credentials')

})

it('should return current user', async () => {

  // Crear usuario
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Pablo',
      email: 'pablo@test.com',
      password: '123456'
    })

  // Hacer login
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'pablo@test.com',
      password: '123456'
    })

  const token = loginResponse.body.token

  // Obtener usuario autenticado
  const response = await request(app)
    .get('/auth/me')
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toBe(200)
  expect(response.body.username).toBe('Pablo')
  expect(response.body.email).toBe('pablo@test.com')

})

it('should reject request without token', async () => {

  const response = await request(app)
    .get('/auth/me')

  expect(response.status).toBe(401)
  expect(response.body.error).toBe('No token provided')

})

it('should reject invalid token', async () => {

  const response = await request(app)
    .get('/auth/me')
    .set('Authorization', 'Bearer invalid-token')

  expect(response.status).toBe(401)
  expect(response.body.error).toBe('Invalid or expired token')

})

it('should update current user', async () => {

  // Register
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Pablo',
      email: 'pablo@test.com',
      password: '123456'
    })

  // Login
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'pablo@test.com',
      password: '123456'
    })

  const token = loginResponse.body.token

  // Update
  const response = await request(app)
    .put('/auth/me')
    .set('Authorization', `Bearer ${token}`)
    .send({
      username: 'PabloRB',
      email: 'pablorb@test.com'
    })

  expect(response.status).toBe(200)
  expect(response.body.username).toBe('PabloRB')
  expect(response.body.email).toBe('pablorb@test.com')

})

it('should deactivate current user', async () => {

  // Register
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Pablo',
      email: 'pablo@test.com',
      password: '123456'
    })

  // Login
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'pablo@test.com',
      password: '123456'
    })

  const token = loginResponse.body.token

  // Delete
  const response = await request(app)
    .delete('/auth/me')
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toBe(200)
  expect(response.body.message).toBe('User deactivated successfully')

})

it('should reject inactive user', async () => {

  // Register
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Pablo',
      email: 'pablo@test.com',
      password: '123456'
    })

  // Login
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'pablo@test.com',
      password: '123456'
    })

  const token = loginResponse.body.token

  // Deactivate
  await request(app)
    .delete('/auth/me')
    .set('Authorization', `Bearer ${token}`)

  // Try to access again
  const response = await request(app)
    .get('/auth/me')
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toBe(401)
  expect(response.body.error).toBe('User is inactive')

})

})