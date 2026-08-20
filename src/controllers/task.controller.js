import { TeamModel } from '../models/team.model.js'
import { UserModel } from '../models/user.model.js'
import { TaskModel } from '../models/task.model.js'
import { createTaskSchema } from '../schemas/create-task.schema.js'
import { uuidParamSchema } from '../schemas/uuid-param.schema.js'

export class TaskController {

  static async create(req, res) {
    try {
      const { teamId } = req.params
      const { title, description, assignedToId } =
        createTaskSchema.parse(req.body)

      uuidParamSchema.parse({
        id: teamId
      })

      const managerId = req.user.id

      const team = await TeamModel.getById(teamId)

      if (!team) {
        return res.status(404).json({
          error: 'Team not found'
        })
      }

      if (team.managerId !== managerId) {
        return res.status(403).json({
          error: 'Only the team manager can create tasks'
        })
      }

      const assignedUser = await UserModel.getById(assignedToId)

      if (!assignedUser) {
        return res.status(404).json({
          error: 'Assigned user not found'
        })
      }

      if (assignedUser.teamId !== teamId) {
        return res.status(400).json({
          error: 'Assigned user does not belong to this team'
        })
      }

      if (assignedUser.role !== 'MEMBER') {
        return res.status(400).json({
          error: 'Tasks can only be assigned to team members with MEMBER role'
        })
      }

      const task = await TaskModel.create({
        title,
        description,
        teamId,
        assignedToId
      })

      return res.status(201).json(task)

    } catch (err) {
      if (err.name === 'ZodError') {
        return res.status(400).json({
          errors: err.issues
        })
      }

      console.error(err)

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }

  static async getMyTasks(req, res) {
  try {
    const tasks = await TaskModel.getByAssignee(req.user.id)

    return res.status(200).json(tasks)

  } catch (err) {
    console.error(err)

    return res.status(500).json({
      error: 'Internal server error'
    })
  }
}

static async updateStatus(req, res) {
  try {
    const { taskId } = req.params
    const { status } = req.body

    uuidParamSchema.parse({
      id: taskId
    })

    const task = await TaskModel.getById(taskId)

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      })
    }

    const userId = req.user.id
    const isManager = task.team.managerId === userId

    // MANAGER → SUBMITTED → DONE
    if (isManager) {
      if (
        task.status !== 'SUBMITTED' ||
        status !== 'DONE'
      ) {
        return res.status(400).json({
          error: 'Invalid task status transition'
        })
      }

      const updatedTask = await TaskModel.updateStatus(
        taskId,
        status
      )

      return res.status(200).json(updatedTask)
    }

    // MEMBER → solo puede modificar sus propias tareas
    if (task.assignedToId !== userId) {
      return res.status(403).json({
        error: 'Only the assigned user can update the task status'
      })
    }

    // MEMBER → SENT → WORKING
    if (
      task.status === 'SENT' &&
      status === 'WORKING'
    ) {
      const updatedTask = await TaskModel.updateStatus(
        taskId,
        status
      )

      return res.status(200).json(updatedTask)
    }

    // MEMBER → WORKING → SUBMITTED
    if (
      task.status === 'WORKING' &&
      status === 'SUBMITTED'
    ) {
      const updatedTask = await TaskModel.updateStatus(
        taskId,
        status
      )

      return res.status(200).json(updatedTask)
    }

    return res.status(400).json({
      error: 'Invalid task status transition'
    })

  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        errors: err.issues
      })
    }

    console.error(err)

    return res.status(500).json({
      error: 'Internal server error'
    })
  }
}

}