import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth.routes.js'
import { organizationRouter } from './routes/organization.routes.js'
import { teamJoinRequestRouter } from './routes/team-join-request.routes.js'

export const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL
}))

app.use(express.json())

app.use('/auth', authRouter)
app.use('/team-join-requests', teamJoinRequestRouter)
app.use('/organizations', organizationRouter)

app.get('/ping', (req, res) => {
  res.json({
    ok: true,
    service: 'auth-api',
    version: '1.0.0'
  })
})

app.get('/', (req, res) => {
  res.json({
    name: 'Auth API',
    status: 'running',
    version: '1.0.0'
  })
})