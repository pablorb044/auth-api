import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { TaskController } from '../controllers/task.controller.js'

export const taskRouter = Router()

taskRouter.post(
  '/teams/:teamId/tasks',
  authMiddleware,
  TaskController.create
)

taskRouter.get(
  '/tasks/me',
  authMiddleware,
  TaskController.getMyTasks
)

taskRouter.patch(
  '/tasks/:taskId/status',
  authMiddleware,
  TaskController.updateStatus
)