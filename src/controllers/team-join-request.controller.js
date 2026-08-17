import { createJoinRequestSchema } from '../schemas/create-join-request.schema.js'
import { TeamModel } from '../models/team.model.js'
import { TeamJoinRequestModel } from '../models/team-join-request.model.js'
import { UserModel } from '../models/user.model.js'

export class TeamJoinRequestController {

  static async create(req, res) {
    try {
      const { teamId } = createJoinRequestSchema.parse(req.body)
      const userId = req.user.id

      const team = await TeamModel.getById(teamId)

      if (!team) {
        return res.status(404).json({
          error: 'Team not found'
        })
      }

      const user = await UserModel.getById(userId)

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        })
      }

      if (user.teamId === teamId) {
        return res.status(400).json({
          error: 'User already belongs to this team'
        })
      }

      const existingRequest =
        await TeamJoinRequestModel.getPendingByUserAndTeam(
          userId,
          teamId
        )

      if (existingRequest) {
        return res.status(400).json({
          error: 'Join request already pending'
        })
      }

      const joinRequest = await TeamJoinRequestModel.create({
        userId,
        teamId
      })

      return res.status(201).json(joinRequest)

    } catch (err) {
      if (err.name === 'ZodError') {
        return res.status(400).json({
          errors: err.issues
        })
      }

      if (err.code === 'P2002') {
        return res.status(400).json({
          error: 'Join request already exists'
        })
      }

      console.error(err)

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }

  static async getPending(req, res) {
    try {
      const userId = req.user.id

      const team = await TeamModel.getByManagerId(userId)

      if (!team) {
        return res.status(403).json({
          error: 'Only team managers can view join requests'
        })
      }

      const requests =
        await TeamJoinRequestModel.getPendingByTeam(team.id)

      return res.status(200).json(requests)

    } catch (err) {
      console.error(err)

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }

  static async approve(req, res) {
    try {
      const { id } = req.params
      const managerId = req.user.id

      const joinRequest = await TeamJoinRequestModel.getById(id)

      if (!joinRequest) {
        return res.status(404).json({
          error: 'Join request not found'
        })
      }

      if (joinRequest.status !== 'pending') {
        return res.status(400).json({
          error: 'Join request is not pending'
        })
      }

      const team = await TeamModel.getByManagerId(managerId)

      if (!team || team.id !== joinRequest.teamId) {
        return res.status(403).json({
          error: 'Only the team manager can approve this request'
        })
      }

      const approvedRequest = await TeamJoinRequestModel.approve(
        id,
        joinRequest.userId,
        joinRequest.teamId
      )

      return res.status(200).json(approvedRequest)

    } catch (err) {
      console.error(err)

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }

  static async reject(req, res) {
    try {
      const { id } = req.params
      const managerId = req.user.id

      const joinRequest = await TeamJoinRequestModel.getById(id)

      if (!joinRequest) {
        return res.status(404).json({
          error: 'Join request not found'
        })
      }

      if (joinRequest.status !== 'pending') {
        return res.status(400).json({
          error: 'Join request is not pending'
        })
      }

      const team = await TeamModel.getByManagerId(managerId)

      if (!team || team.id !== joinRequest.teamId) {
        return res.status(403).json({
          error: 'Only the team manager can reject this request'
        })
      }

      const rejectedRequest = await TeamJoinRequestModel.reject(id)

      return res.status(200).json(rejectedRequest)

    } catch (err) {
      console.error(err)

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }

}