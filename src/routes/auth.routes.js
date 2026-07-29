import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const authRouter = Router()

authRouter.post('/register', AuthController.register)
authRouter.post('/login', AuthController.login)

// Ruta protegida
authRouter.get('/me', authMiddleware, AuthController.me)
authRouter.put('/me', authMiddleware, AuthController.updateMe)
authRouter.delete('/me', authMiddleware, AuthController.deleteMe)