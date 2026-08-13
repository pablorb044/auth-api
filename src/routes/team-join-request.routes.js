import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { TeamJoinRequestController } from '../controllers/team-join-request.controller.js'

export const teamJoinRequestRouter = Router()

teamJoinRequestRouter.post(
  '/',
  authMiddleware,
  TeamJoinRequestController.create
)