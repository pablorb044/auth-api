import { Router } from 'express'
import { OrganizationController } from '../controllers/organization.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const organizationRouter = Router()

organizationRouter.post(
  '/',
  authMiddleware,
  OrganizationController.create
)

organizationRouter.get(
  '/:organizationId',
  authMiddleware,
  OrganizationController.get
)

organizationRouter.get(
  '/:organizationId/members',
  authMiddleware,
  OrganizationController.getMembers
)