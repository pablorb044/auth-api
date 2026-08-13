import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'

describe('Auth API', () => {

  beforeEach(async () => {
  await prisma.teamJoinRequest.deleteMany()
  await prisma.team.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()
  })

  it('should respond to ping', async () => {
  const response = await request(app).get('/ping')

  expect(response.status).toBe(200)
  expect(response.body).toEqual({
    ok: true,
    service: 'auth-api',
    version: '1.0.0'
  })
})

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

it('should respond to root endpoint', async () => {
  const response = await request(app).get('/')

  expect(response.status).toBe(200)
  expect(response.body).toEqual({
    name: 'Auth API',
    status: 'running',
    version: '1.0.0'
  })
})

it('should create an organization and team', async () => {

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

  // Create organization
  const response = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${token}`)
    .send({
      organizationName: 'Carnes Paco S.L.',
      teamName: 'Sección de embutidos'
    })

  expect(response.status).toBe(201)

  expect(response.body.organization.name).toBe('Carnes Paco S.L.')
  expect(response.body.team.name).toBe('Sección de embutidos')

  expect(response.body.manager.username).toBe('Pablo')
  expect(response.body.manager.email).toBe('pablo@test.com')
  expect(response.body.manager.role).toBe('manager')
})

it('should reject creating a second team for the same manager', async () => {

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

  // First organization/team
  await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${token}`)
    .send({
      organizationName: 'Carnes Paco S.L.',
      teamName: 'Sección de embutidos'
    })

  // Second organization/team
  const response = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${token}`)
    .send({
      organizationName: 'Otra Empresa',
      teamName: 'Otro Equipo'
    })

  expect(response.status).toBe(400)
  expect(response.body.error)
    .toBe('Organization or manager already has a team')
})

it('should reject organization creation without authentication', async () => {

  const response = await request(app)
    .post('/organizations')
    .send({
      organizationName: 'Carnes Paco S.L.',
      teamName: 'Sección de embutidos'
    })

  expect(response.status).toBe(401)
  expect(response.body.error).toBe('No token provided')
})

it('should create a team join request', async () => {

  // Crear manager
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const managerLogin = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = managerLogin.body.token

  // Crear organización + team
  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  // Crear usuario que quiere entrar
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Pablo',
      email: 'pablo@test.com',
      password: '123456'
    })

  const userLogin = await request(app)
    .post('/auth/login')
    .send({
      email: 'pablo@test.com',
      password: '123456'
    })

  const userToken = userLogin.body.token

  // Solicitar entrada
  const response = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId
    })

  expect(response.status).toBe(201)
  expect(response.body.userId).toBeDefined()
  expect(response.body.teamId).toBe(teamId)
  expect(response.body.status).toBe('pending')
})

it('should reject duplicate pending team join request', async () => {

  // Manager
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const managerLogin = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = managerLogin.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  // Usuario
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Pablo',
      email: 'pablo@test.com',
      password: '123456'
    })

  const userLogin = await request(app)
    .post('/auth/login')
    .send({
      email: 'pablo@test.com',
      password: '123456'
    })

  const userToken = userLogin.body.token

  // Primera solicitud
  await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId
    })

  // Segunda solicitud
  const response = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId
    })

  expect(response.status).toBe(400)
  expect(response.body.error).toBe('Join request already pending')
})

it('should reject join request for nonexistent team', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Pablo',
      email: 'pablo@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'pablo@test.com',
      password: '123456'
    })

  const token = loginResponse.body.token

  const response = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${token}`)
    .send({
      teamId: '00000000-0000-0000-0000-000000000000'
    })

  expect(response.status).toBe(404)
  expect(response.body.error).toBe('Team not found')
})

it('should reject join request when user already belongs to team', async () => {

  // Crear manager
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const managerLogin = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = managerLogin.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  // El manager ya pertenece al team como manager
  const response = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      teamId
    })

  expect(response.status).toBe(400)
  expect(response.body.error).toBe('User already belongs to this team')
})

it('should reject team join request without authentication', async () => {

  const response = await request(app)
    .post('/team-join-requests')
    .send({
      teamId: '00000000-0000-0000-0000-000000000000'
    })

  expect(response.status).toBe(401)
  expect(response.body.error).toBe('No token provided')
})

afterAll(async () => {
  await prisma.$disconnect()
})

})