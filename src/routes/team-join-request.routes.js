import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { TeamJoinRequestController } from '../controllers/team-join-request.controller.js'

export const teamJoinRequestRouter = Router()

teamJoinRequestRouter.post(
  '/',
  authMiddleware,
  TeamJoinRequestController.create
)

teamJoinRequestRouter.get(
  '/',
  authMiddleware,
  TeamJoinRequestController.getPending
)

teamJoinRequestRouter.patch(
  '/:id/approve',
  authMiddleware,
  TeamJoinRequestController.approve
)

teamJoinRequestRouter.patch(
  '/:id/reject',
  authMiddleware,
  TeamJoinRequestController.reject
)