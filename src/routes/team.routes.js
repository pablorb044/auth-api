import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { TeamController } from '../controllers/team.controller.js'

export const teamRouter = Router()

teamRouter.get(
  '/:teamId',
  authMiddleware,
  TeamController.getTeam
)

teamRouter.get(
  '/:teamId/members',
  authMiddleware,
  TeamController.getMembers
)

teamRouter.delete(
  '/:teamId/members/me',
  authMiddleware,
  TeamController.leave
)

teamRouter.delete(
  '/:teamId/members/:userId',
  authMiddleware,
  TeamController.removeMember
)

teamRouter.delete(
  '/:teamId',
  authMiddleware,
  TeamController.delete
)

teamRouter.patch(
  '/:teamId/members/:userId/role',
  authMiddleware,
  TeamController.updateMemberRole
)

teamRouter.patch(
  '/:teamId',
  authMiddleware,
  TeamController.update
)
