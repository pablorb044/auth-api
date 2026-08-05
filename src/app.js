import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth.routes.js'

export const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL
}))

app.use(express.json())

app.use('/auth', authRouter)

app.get('/ping', (req, res) => {
  res.json({ ok: true })
})