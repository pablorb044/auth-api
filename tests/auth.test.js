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

})