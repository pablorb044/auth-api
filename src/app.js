import express from 'express'
import { authRouter } from './routes/auth.routes.js'

export const app = express()

app.use(express.json())

app.use('/auth', authRouter)

app.get('/ping', (req, res) => {
  res.json({ ok: true })
})