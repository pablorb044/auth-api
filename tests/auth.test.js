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

it('should return pending team join requests for manager', async () => {

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

  // Crear organization + team
  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  // Crear usuario
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

  // Crear join request
  await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId
    })

  // Manager consulta solicitudes
  const response = await request(app)
    .get('/team-join-requests')
    .set('Authorization', `Bearer ${managerToken}`)

  expect(response.status).toBe(200)
  expect(response.body).toHaveLength(1)
  expect(response.body[0].teamId).toBe(teamId)
  expect(response.body[0].userId).toBeDefined()
  expect(response.body[0].status).toBe('pending')
})

it('should reject viewing team join requests for non-manager', async () => {

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
    .get('/team-join-requests')
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toBe(403)
  expect(response.body.error)
    .toBe('Only team managers can view join requests')
})

it('should approve a team join request', async () => {

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

  // Team
  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  // Employee
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

  // Request
  const joinRequestResponse = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId
    })

  const requestId = joinRequestResponse.body.id

  // Approve
  const response = await request(app)
    .patch(`/team-join-requests/${requestId}/approve`)
    .set('Authorization', `Bearer ${managerToken}`)

  expect(response.status).toBe(200)
  expect(response.body.status).toBe('approved')

  // Comprobar membership
  const user = await prisma.user.findUnique({
    where: {
      email: 'pablo@test.com'
    }
  })

  expect(user.teamId).toBe(teamId)
})

it('should reject approving a join request for non-manager', async () => {

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

  // Team
  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  // Employee
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

  // Join request
  const joinRequestResponse = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId
    })

  const requestId = joinRequestResponse.body.id

  // Employee intenta aprobar
  const response = await request(app)
    .patch(`/team-join-requests/${requestId}/approve`)
    .set('Authorization', `Bearer ${userToken}`)

  expect(response.status).toBe(403)
  expect(response.body.error)
    .toBe('Only the team manager can approve this request')
})

it('should reject approving a join request that is no longer pending', async () => {

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

  // Team
  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  // Employee
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

  // Join request
  const joinRequestResponse = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId
    })

  const requestId = joinRequestResponse.body.id

  // First approval
  await request(app)
    .patch(`/team-join-requests/${requestId}/approve`)
    .set('Authorization', `Bearer ${managerToken}`)

  // Second approval
  const response = await request(app)
    .patch(`/team-join-requests/${requestId}/approve`)
    .set('Authorization', `Bearer ${managerToken}`)

  expect(response.status).toBe(400)
  expect(response.body.error)
    .toBe('Join request is not pending')
})

it('should reject manager from another team approving a join request', async () => {

  // Manager 1
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager1',
      email: 'manager1@test.com',
      password: '123456'
    })

  const manager1Login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager1@test.com',
      password: '123456'
    })

  const manager1Token = manager1Login.body.token

  // Team 1
  const organization1Response = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${manager1Token}`)
    .send({
      organizationName: 'Acme 1',
      teamName: 'Engineering'
    })

  const team1Id = organization1Response.body.team.id

  // Manager 2
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager2',
      email: 'manager2@test.com',
      password: '123456'
    })

  const manager2Login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager2@test.com',
      password: '123456'
    })

  const manager2Token = manager2Login.body.token

  // Team 2
  await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${manager2Token}`)
    .send({
      organizationName: 'Acme 2',
      teamName: 'Marketing'
    })

  // Employee
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

  // Request para Team 1
  const joinRequestResponse = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId: team1Id
    })

  const requestId = joinRequestResponse.body.id

  // Manager 2 intenta aprobar una request de Team 1
  const response = await request(app)
    .patch(`/team-join-requests/${requestId}/approve`)
    .set('Authorization', `Bearer ${manager2Token}`)

  expect(response.status).toBe(403)
  expect(response.body.error)
    .toBe('Only the team manager can approve this request')
})

it('should reject a team join request', async () => {

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

  // Team
  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  // Employee
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

  // Request
  const joinRequestResponse = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId
    })

  const requestId = joinRequestResponse.body.id

  // Reject
  const response = await request(app)
    .patch(`/team-join-requests/${requestId}/reject`)
    .set('Authorization', `Bearer ${managerToken}`)

  expect(response.status).toBe(200)
  expect(response.body.status).toBe('rejected')
})

it('should reject rejecting a join request for non-manager', async () => {

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

  const joinRequest = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ teamId })

  const requestId = joinRequest.body.id

  const response = await request(app)
    .patch(`/team-join-requests/${requestId}/reject`)
    .set('Authorization', `Bearer ${userToken}`)

  expect(response.status).toBe(403)
  expect(response.body.error)
    .toBe('Only the team manager can reject this request')
})

it('should reject rejecting a join request that is no longer pending', async () => {

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

  // Team
  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  // Employee
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

  // Join request
  const joinRequest = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId
    })

  const requestId = joinRequest.body.id

  // First reject
  await request(app)
    .patch(`/team-join-requests/${requestId}/reject`)
    .set('Authorization', `Bearer ${managerToken}`)

  // Second reject
  const response = await request(app)
    .patch(`/team-join-requests/${requestId}/reject`)
    .set('Authorization', `Bearer ${managerToken}`)

  expect(response.status).toBe(400)
  expect(response.body.error)
    .toBe('Join request is not pending')
})

it('should reject manager from another team rejecting a join request', async () => {

  // Manager 1
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager1',
      email: 'manager1@test.com',
      password: '123456'
    })

  const manager1Login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager1@test.com',
      password: '123456'
    })

  const manager1Token = manager1Login.body.token

  // Team 1
  const organization1Response = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${manager1Token}`)
    .send({
      organizationName: 'Acme 1',
      teamName: 'Engineering'
    })

  const team1Id = organization1Response.body.team.id

  // Manager 2
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager2',
      email: 'manager2@test.com',
      password: '123456'
    })

  const manager2Login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager2@test.com',
      password: '123456'
    })

  const manager2Token = manager2Login.body.token

  // Team 2
  await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${manager2Token}`)
    .send({
      organizationName: 'Acme 2',
      teamName: 'Marketing'
    })

  // Employee
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

  // Request para Team 1
  const joinRequest = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId: team1Id
    })

  const requestId = joinRequest.body.id

  // Manager 2 intenta rechazar una request de Team 1
  const response = await request(app)
    .patch(`/team-join-requests/${requestId}/reject`)
    .set('Authorization', `Bearer ${manager2Token}`)

  expect(response.status).toBe(403)
  expect(response.body.error)
    .toBe('Only the team manager can reject this request')
})

it('should return team for a team member', async () => {

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

  const response = await request(app)
    .get(`/teams/${teamId}`)
    .set('Authorization', `Bearer ${managerToken}`)

  expect(response.status).toBe(200)
  expect(response.body.id).toBe(teamId)
  expect(response.body.name).toBe('Engineering')
  expect(response.body.manager.username).toBe('Manager')
})

it('should reject getting a nonexistent team', async () => {

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
    .get('/teams/00000000-0000-0000-0000-000000000000')
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toBe(404)
  expect(response.body.error).toBe('Team not found')
})

it('should reject getting a team for a user from another team', async () => {

  // Manager 1
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager1',
      email: 'manager1@test.com',
      password: '123456'
    })

  const manager1Login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager1@test.com',
      password: '123456'
    })

  const manager1Token = manager1Login.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${manager1Token}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  // Usuario externo
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

  const response = await request(app)
    .get(`/teams/${teamId}`)
    .set('Authorization', `Bearer ${userToken}`)

  expect(response.status).toBe(403)
  expect(response.body.error).toBe('You do not belong to this team')
})

it('should reject getting a team without authentication', async () => {

  const response = await request(app)
    .get('/teams/00000000-0000-0000-0000-000000000000')

  expect(response.status).toBe(401)
  expect(response.body.error).toBe('No token provided')
})

it('should return team members', async () => {

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

  // Employee
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

  // Employee solicita entrar
  const joinRequest = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ teamId })

  // Manager aprueba
  await request(app)
    .patch(`/team-join-requests/${joinRequest.body.id}/approve`)
    .set('Authorization', `Bearer ${managerToken}`)

  const response = await request(app)
    .get(`/teams/${teamId}/members`)
    .set('Authorization', `Bearer ${userToken}`)

  expect(response.status).toBe(200)
  expect(response.body).toHaveLength(2)

  expect(response.body.map(member => member.username))
    .toContain('Manager')

  expect(response.body.map(member => member.username))
    .toContain('Pablo')
})

it('should reject getting members from a nonexistent team', async () => {

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
    .get('/teams/00000000-0000-0000-0000-000000000000/members')
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toBe(404)
  expect(response.body.error).toBe('Team not found')
})

it('should reject getting members for a user from another team', async () => {

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

  // Usuario externo
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

  const response = await request(app)
    .get(`/teams/${teamId}/members`)
    .set('Authorization', `Bearer ${userToken}`)

  expect(response.status).toBe(403)
  expect(response.body.error).toBe('You do not belong to this team')
})

it('should reject getting team members without authentication', async () => {

  const response = await request(app)
    .get('/teams/00000000-0000-0000-0000-000000000000/members')

  expect(response.status).toBe(401)
  expect(response.body.error).toBe('No token provided')
})

it('should allow a team member to leave the team', async () => {

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

  // Employee
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

  // Join request
  const joinRequest = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ teamId })

  // Approve
  await request(app)
    .patch(`/team-join-requests/${joinRequest.body.id}/approve`)
    .set('Authorization', `Bearer ${managerToken}`)

  // Leave
  const response = await request(app)
    .delete(`/teams/${teamId}/members/me`)
    .set('Authorization', `Bearer ${userToken}`)

  expect(response.status).toBe(200)
  expect(response.body.message).toBe('Left team successfully')

  const user = await prisma.user.findUnique({
    where: {
      email: 'pablo@test.com'
    }
  })

  expect(user.teamId).toBeNull()
})

it('should reject leaving a team that the user does not belong to', async () => {

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

  // Usuario externo
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

  const response = await request(app)
    .delete(`/teams/${teamId}/members/me`)
    .set('Authorization', `Bearer ${userToken}`)

  expect(response.status).toBe(403)
  expect(response.body.error).toBe('You do not belong to this team')
})

it('should reject manager from leaving their own team', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = loginResponse.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  const response = await request(app)
    .delete(`/teams/${teamId}/members/me`)
    .set('Authorization', `Bearer ${managerToken}`)

  expect(response.status).toBe(400)
  expect(response.body.error).toBe('Team manager cannot leave the team')
})

it('should allow manager to remove a team member', async () => {

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

  // Member
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

  // Join
  const joinRequest = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ teamId })

  await request(app)
    .patch(`/team-join-requests/${joinRequest.body.id}/approve`)
    .set('Authorization', `Bearer ${managerToken}`)

  const user = await prisma.user.findUnique({
    where: {
      email: 'pablo@test.com'
    }
  })

  // Remove
  const response = await request(app)
    .delete(`/teams/${teamId}/members/${user.id}`)
    .set('Authorization', `Bearer ${managerToken}`)

  expect(response.status).toBe(200)
  expect(response.body.message).toBe('Member removed successfully')

  const updatedUser = await prisma.user.findUnique({
    where: {
      id: user.id
    }
  })

  expect(updatedUser.teamId).toBeNull()
})

it('should reject removing a member for non-manager', async () => {

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

  // Second user
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

  const joinRequest = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ teamId })

  await request(app)
    .patch(`/team-join-requests/${joinRequest.body.id}/approve`)
    .set('Authorization', `Bearer ${managerToken}`)

  const user = await prisma.user.findUnique({
    where: {
      email: 'pablo@test.com'
    }
  })

  const response = await request(app)
    .delete(`/teams/${teamId}/members/${user.id}`)
    .set('Authorization', `Bearer ${userToken}`)

  expect(response.status).toBe(403)
  expect(response.body.error)
    .toBe('Only the team manager can remove members')
})

it('should reject removing a nonexistent team member', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = loginResponse.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  const response = await request(app)
    .delete(`/teams/${teamId}/members/00000000-0000-0000-0000-000000000000`)
    .set('Authorization', `Bearer ${managerToken}`)

  expect(response.status).toBe(404)
  expect(response.body.error)
    .toBe('User is not a member of this team')
})

it('should reject manager from removing themselves', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = loginResponse.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  const manager = await prisma.user.findUnique({
    where: {
      email: 'manager@test.com'
    }
  })

  const response = await request(app)
    .delete(`/teams/${teamId}/members/${manager.id}`)
    .set('Authorization', `Bearer ${managerToken}`)

  expect(response.status).toBe(400)
  expect(response.body.error)
    .toBe('Team manager cannot be removed')
})

it('should allow manager to update a team member role', async () => {
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

  const joinRequest = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ teamId })

  await request(app)
    .patch(`/team-join-requests/${joinRequest.body.id}/approve`)
    .set('Authorization', `Bearer ${managerToken}`)

  const user = await prisma.user.findUnique({
    where: {
      email: 'pablo@test.com'
    }
  })

  const response = await request(app)
    .patch(`/teams/${teamId}/members/${user.id}/role`)
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      role: 'MEMBER'
    })

  expect(response.status).toBe(200)
  expect(response.body.message).toBe('Member role updated successfully')
})

it('should reject updating member role for non-manager', async () => {
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

  const response = await request(app)
    .patch(`/teams/${teamId}/members/fake-user-id/role`)
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      role: 'MEMBER'
    })

  expect(response.status).toBe(403)
  expect(response.body.error).toBe(
    'Only the team manager can update member roles'
  )
})

it('should reject updating a nonexistent team', async () => {
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const token = loginResponse.body.token

  const response = await request(app)
    .patch('/teams/nonexistent-team/members/fake-user/role')
    .set('Authorization', `Bearer ${token}`)
    .send({
      role: 'MEMBER'
    })

  expect(response.status).toBe(404)
  expect(response.body.error).toBe('Team not found')
})

it('should reject invalid member role', async () => {
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const token = loginResponse.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${token}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  const response = await request(app)
    .patch(`/teams/${teamId}/members/fake-user/role`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      role: 'ADMIN'
    })

  expect(response.status).toBe(400)
  expect(response.body.error).toBe('Invalid role')
})

it('should reject updating member role without authentication', async () => {
  const response = await request(app)
    .patch('/teams/fake-team/members/fake-user/role')
    .send({
      role: 'MEMBER'
    })

  expect(response.status).toBe(401)
})

it('should reject manager from updating their own role', async () => {
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = loginResponse.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  const manager = await prisma.user.findUnique({
    where: {
      email: 'manager@test.com'
    }
  })

  const response = await request(app)
    .patch(`/teams/${teamId}/members/${manager.id}/role`)
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      role: 'MEMBER'
    })

  expect(response.status).toBe(400)
  expect(response.body.error).toBe(
    'Team manager role cannot be changed'
  )
})

it('should reject updating a user who is not a team member', async () => {
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = loginResponse.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Pablo',
      email: 'pablo@test.com',
      password: '123456'
    })

  const user = await prisma.user.findUnique({
    where: {
      email: 'pablo@test.com'
    }
  })

  const response = await request(app)
    .patch(`/teams/${teamId}/members/${user.id}/role`)
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      role: 'MEMBER'
    })

  expect(response.status).toBe(404)
  expect(response.body.error).toBe(
    'User is not a member of this team'
  )
})

it('should reject manager from another team updating a member role', async () => {
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager1',
      email: 'manager1@test.com',
      password: '123456'
    })

  const manager1Login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager1@test.com',
      password: '123456'
    })

  const manager1Token = manager1Login.body.token

  const organization1 = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${manager1Token}`)
    .send({
      organizationName: 'Acme1',
      teamName: 'Engineering1'
    })

  const team1Id = organization1.body.team.id

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager2',
      email: 'manager2@test.com',
      password: '123456'
    })

  const manager2Login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager2@test.com',
      password: '123456'
    })

  const manager2Token = manager2Login.body.token

  await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${manager2Token}`)
    .send({
      organizationName: 'Acme2',
      teamName: 'Engineering2'
    })

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

  const joinRequest = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId: team1Id
    })

  await request(app)
    .patch(`/team-join-requests/${joinRequest.body.id}/approve`)
    .set('Authorization', `Bearer ${manager1Token}`)

  const user = await prisma.user.findUnique({
    where: {
      email: 'pablo@test.com'
    }
  })

  const response = await request(app)
    .patch(`/teams/${team1Id}/members/${user.id}/role`)
    .set('Authorization', `Bearer ${manager2Token}`)
    .send({
      role: 'MEMBER'
    })

  expect(response.status).toBe(403)
  expect(response.body.error).toBe(
    'Only the team manager can update member roles'
  )
})

it('should return an organization for a team member', async () => {
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${login.body.token}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const organizationId =
    organizationResponse.body.organization.id

  const response = await request(app)
    .get(`/organizations/${organizationId}`)
    .set('Authorization', `Bearer ${login.body.token}`)

  expect(response.status).toBe(200)
  expect(response.body.id).toBe(organizationId)
  expect(response.body.team.name).toBe('Engineering')
})

it('should reject getting a nonexistent organization', async () => {
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Pablo',
      email: 'pablo@test.com',
      password: '123456'
    })

  const login = await request(app)
    .post('/auth/login')
    .send({
      email: 'pablo@test.com',
      password: '123456'
    })

  const response = await request(app)
    .get('/organizations/nonexistent-id')
    .set('Authorization', `Bearer ${login.body.token}`)

  expect(response.status).toBe(404)
  expect(response.body.error).toBe('Organization not found')
})

it('should reject getting an organization for a user from another organization', async () => {
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

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerLogin.body.token}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const organizationId =
    organizationResponse.body.organization.id

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

  const response = await request(app)
    .get(`/organizations/${organizationId}`)
    .set('Authorization', `Bearer ${userLogin.body.token}`)

  expect(response.status).toBe(403)
  expect(response.body.error)
    .toBe('You do not belong to this organization')
})

it('should return organization members', async () => {
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

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerLogin.body.token}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const organizationId =
    organizationResponse.body.organization.id

  const response = await request(app)
    .get(`/organizations/${organizationId}/members`)
    .set('Authorization', `Bearer ${managerLogin.body.token}`)

  expect(response.status).toBe(200)
  expect(response.body).toHaveLength(1)
  expect(response.body[0].email).toBe('manager@test.com')
})

it('should allow the organization manager to update the organization name', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = login.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const organizationId = organizationResponse.body.organization.id

  const response = await request(app)
    .patch(`/organizations/${organizationId}`)
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      name: 'Acme Updated'
    })

  expect(response.status).toBe(200)
  expect(response.body.name).toBe('Acme Updated')
})


it('should reject updating an organization for a non-manager member', async () => {

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

  const organizationId = organizationResponse.body.organization.id
  const teamId = organizationResponse.body.team.id

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

  const joinRequest = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ teamId })

  await request(app)
    .patch(`/team-join-requests/${joinRequest.body.id}/approve`)
    .set('Authorization', `Bearer ${managerToken}`)

  const response = await request(app)
    .patch(`/organizations/${organizationId}`)
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      name: 'Hacked'
    })

  expect(response.status).toBe(403)
  expect(response.body.error).toBe(
    'Only the organization manager can update it'
  )
})


it('should reject updating an organization from another organization', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager1',
      email: 'manager1@test.com',
      password: '123456'
    })

  const login1 = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager1@test.com',
      password: '123456'
    })

  const manager1Token = login1.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${manager1Token}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const organizationId = organizationResponse.body.organization.id

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager2',
      email: 'manager2@test.com',
      password: '123456'
    })

  const login2 = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager2@test.com',
      password: '123456'
    })

  const manager2Token = login2.body.token

  await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${manager2Token}`)
    .send({
      organizationName: 'Other',
      teamName: 'Other Team'
    })

  const response = await request(app)
    .patch(`/organizations/${organizationId}`)
    .set('Authorization', `Bearer ${manager2Token}`)
    .send({
      name: 'Hacked'
    })

  expect(response.status).toBe(403)
  expect(response.body.error).toBe(
    'You do not belong to this organization'
  )
})


it('should reject updating a nonexistent organization', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = login.body.token

  const response = await request(app)
    .patch('/organizations/nonexistent-id')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      name: 'Acme'
    })

  expect(response.status).toBe(404)
  expect(response.body.error).toBe('Organization not found')
})


it('should reject updating an organization with an invalid name', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = login.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const organizationId = organizationResponse.body.organization.id

  const response = await request(app)
    .patch(`/organizations/${organizationId}`)
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      name: 'A'
    })

  expect(response.status).toBe(400)
})

it('should allow the team manager to update the team name', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = loginResponse.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  const response = await request(app)
    .patch(`/teams/${teamId}`)
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      name: 'Backend'
    })

  expect(response.status).toBe(200)
  expect(response.body.name).toBe('Backend')
})


it('should reject updating a team for a non-manager member', async () => {

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

  const joinRequest = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ teamId })

  await request(app)
    .patch(`/team-join-requests/${joinRequest.body.id}/approve`)
    .set('Authorization', `Bearer ${managerToken}`)

  const response = await request(app)
    .patch(`/teams/${teamId}`)
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      name: 'Backend'
    })

  expect(response.status).toBe(403)
  expect(response.body.error).toBe('Only the team manager can update it')
})


it('should reject updating a team from another team', async () => {

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

  await request(app)
    .post('/auth/register')
    .send({
      username: 'OtherManager',
      email: 'other@test.com',
      password: '123456'
    })

  const otherLogin = await request(app)
    .post('/auth/login')
    .send({
      email: 'other@test.com',
      password: '123456'
    })

  const otherToken = otherLogin.body.token

  const otherOrganization = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${otherToken}`)
    .send({
      organizationName: 'Other',
      teamName: 'OtherTeam'
    })

  expect(otherOrganization.status).toBe(201)

  const response = await request(app)
    .patch(`/teams/${teamId}`)
    .set('Authorization', `Bearer ${otherToken}`)
    .send({
      name: 'Backend'
    })

  expect(response.status).toBe(403)
  expect(response.body.error).toBe('You do not belong to this team')
})


it('should reject updating a nonexistent team', async () => {

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
    .patch('/teams/nonexistent-team-id')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Backend'
    })

  expect(response.status).toBe(404)
  expect(response.body.error).toBe('Team not found')
})


it('should reject updating a team with an invalid name', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = loginResponse.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  const response = await request(app)
    .patch(`/teams/${teamId}`)
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      name: 'A'
    })

  expect(response.status).toBe(400)
  expect(response.body.errors).toBeDefined()
})

it('should allow the team manager to delete the team', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = loginResponse.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Delete Org',
      teamName: 'Delete Team'
    })

  const teamId = organizationResponse.body.team.id

  const response = await request(app)
    .delete(`/teams/${teamId}`)
    .set('Authorization', `Bearer ${managerToken}`)

  expect(response.status).toBe(200)
  expect(response.body.message).toBe('Team deleted successfully')
})

it('should reject deleting a team for a non-manager member', async () => {

  // Manager
  await request(app)
    .post('/auth/register')
    .send({
      username: 'DeleteManager',
      email: 'delete-manager@test.com',
      password: '123456'
    })

  const managerLogin = await request(app)
    .post('/auth/login')
    .send({
      email: 'delete-manager@test.com',
      password: '123456'
    })

  const managerToken = managerLogin.body.token

  // Team
  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Delete Org',
      teamName: 'Delete Team'
    })

  const teamId = organizationResponse.body.team.id

  // Employee
  await request(app)
    .post('/auth/register')
    .send({
      username: 'DeleteMember',
      email: 'delete-member@test.com',
      password: '123456'
    })

  const userLogin = await request(app)
    .post('/auth/login')
    .send({
      email: 'delete-member@test.com',
      password: '123456'
    })

  const userToken = userLogin.body.token

  // Join request
  const joinRequestResponse = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId
    })

  const requestId = joinRequestResponse.body.id

  // Approve
  const approveResponse = await request(app)
    .patch(`/team-join-requests/${requestId}/approve`)
    .set('Authorization', `Bearer ${managerToken}`)

  expect(approveResponse.status).toBe(200)

  // Delete attempt as member
  const response = await request(app)
    .delete(`/teams/${teamId}`)
    .set('Authorization', `Bearer ${userToken}`)

  expect(response.status).toBe(403)
})

it('should reject deleting a team from another team', async () => {

  // Manager 1
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager1',
      email: 'manager1@test.com',
      password: '123456'
    })

  const manager1Login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager1@test.com',
      password: '123456'
    })

  const manager1Token = manager1Login.body.token

  const organization1 = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${manager1Token}`)
    .send({
      organizationName: 'Acme 1',
      teamName: 'Engineering'
    })

  const team1Id = organization1.body.team.id

  // Manager 2
  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager2',
      email: 'manager2@test.com',
      password: '123456'
    })

  const manager2Login = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager2@test.com',
      password: '123456'
    })

  const manager2Token = manager2Login.body.token

  const organization2 = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${manager2Token}`)
    .send({
      organizationName: 'Acme 2',
      teamName: 'Marketing'
    })

  const team2Id = organization2.body.team.id

  const response = await request(app)
    .delete(`/teams/${team1Id}`)
    .set('Authorization', `Bearer ${manager2Token}`)

  expect(response.status).toBe(403)

  const teamResponse = await request(app)
    .get(`/teams/${team2Id}`)
    .set('Authorization', `Bearer ${manager2Token}`)

  expect(teamResponse.status).toBe(200)
})

it('should reject deleting a nonexistent team', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'DeleteManager',
      email: 'delete-manager@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'delete-manager@test.com',
      password: '123456'
    })

  const managerToken = loginResponse.body.token

  const response = await request(app)
    .delete('/teams/00000000-0000-0000-0000-000000000000')
    .set('Authorization', `Bearer ${managerToken}`)

  expect(response.status).toBe(404)
  expect(response.body.error).toBe('Team not found')
})

it('should reject deleting a team without authentication', async () => {

  const response = await request(app)
    .delete('/teams/00000000-0000-0000-0000-000000000000')

  expect(response.status).toBe(401)
  expect(response.body.error).toBe('No token provided')
})

it('should clear team membership when deleting a team', async () => {

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

  const joinRequest = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId
    })

  await request(app)
    .patch(`/team-join-requests/${joinRequest.body.id}/approve`)
    .set('Authorization', `Bearer ${managerToken}`)

  const userBeforeDelete = await prisma.user.findUnique({
    where: {
      email: 'pablo@test.com'
    }
  })

  expect(userBeforeDelete.teamId).toBe(teamId)

  await request(app)
    .delete(`/teams/${teamId}`)
    .set('Authorization', `Bearer ${managerToken}`)

  const userAfterDelete = await prisma.user.findUnique({
    where: {
      email: 'pablo@test.com'
    }
  })

  expect(userAfterDelete.teamId).toBeNull()
})

it('should reset manager role when deleting a team', async () => {

  await request(app)
    .post('/auth/register')
    .send({
      username: 'Manager',
      email: 'manager@test.com',
      password: '123456'
    })

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'manager@test.com',
      password: '123456'
    })

  const managerToken = loginResponse.body.token

  const organizationResponse = await request(app)
    .post('/organizations')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      organizationName: 'Acme',
      teamName: 'Engineering'
    })

  const teamId = organizationResponse.body.team.id

  const managerBeforeDelete = await prisma.user.findUnique({
    where: {
      email: 'manager@test.com'
    }
  })

  expect(managerBeforeDelete.role).toBe('manager')
  expect(managerBeforeDelete.teamId).toBe(teamId)

  await request(app)
    .delete(`/teams/${teamId}`)
    .set('Authorization', `Bearer ${managerToken}`)

  const managerAfterDelete = await prisma.user.findUnique({
    where: {
      email: 'manager@test.com'
    }
  })

  expect(managerAfterDelete.role).toBe('user')
  expect(managerAfterDelete.teamId).toBeNull()
})

it('should remove pending join requests when deleting a team', async () => {

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

  const joinRequestResponse = await request(app)
    .post('/team-join-requests')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      teamId
    })

  expect(joinRequestResponse.body.status).toBe('pending')

  await request(app)
    .delete(`/teams/${teamId}`)
    .set('Authorization', `Bearer ${managerToken}`)

  const joinRequest = await prisma.teamJoinRequest.findUnique({
    where: {
      id: joinRequestResponse.body.id
    }
  })

  expect(joinRequest).toBeNull()
})



afterAll(async () => {
  await prisma.$disconnect()
})

})