import { TeamModel } from '../models/team.model.js'
import { UserModel } from '../models/user.model.js'
import { updateTeamSchema } from '../schemas/update-team.schema.js'
import { uuidParamSchema } from '../schemas/uuid-param.schema.js'

async function getTeamMember(userId, teamId) {
  const user = await UserModel.getById(userId)

  if (!user || user.teamId !== teamId) {
    return null
  }

  return user
}

function isTeamManager(team, userId) {
  return team.managerId === userId
}

export class TeamController {

  static async getTeam(req, res) {
    try {
      const { teamId } = req.params

      uuidParamSchema.parse({
        id: teamId
      })

      const userId = req.user.id

      const team = await TeamModel.getWithManager(teamId)

      if (!team) {
        return res.status(404).json({
          error: 'Team not found'
        })
      }

      const user = await getTeamMember(userId, teamId)

      if (!user) {
        return res.status(403).json({
          error: 'You do not belong to this team'
        })
      }

      return res.status(200).json(team)

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

  static async getMembers(req, res) {
    try {
      const { teamId } = req.params
      const userId = req.user.id

      const team = await TeamModel.getById(teamId)

      if (!team) {
        return res.status(404).json({
          error: 'Team not found'
        })
      }

      const user = await getTeamMember(userId, teamId)

      if (!user) {
        return res.status(403).json({
          error: 'You do not belong to this team'
        })
      }

      const members = await TeamModel.getMembers(teamId)

      return res.status(200).json(members)

    } catch (err) {
      console.error(err)

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }

  static async leave(req, res) {
    try {
      const { teamId } = req.params
      const userId = req.user.id

      const team = await TeamModel.getById(teamId)

      if (!team) {
        return res.status(404).json({
          error: 'Team not found'
        })
      }

      const user = await getTeamMember(userId, teamId)

      if (!user) {
        return res.status(403).json({
          error: 'You do not belong to this team'
        })
      }

      if (isTeamManager(team, userId)) {
        return res.status(400).json({
          error: 'Team manager cannot leave the team'
        })
      }

      const updatedUser = await TeamModel.removeMember(userId)

      return res.status(200).json({
        message: 'Left team successfully',
        user: updatedUser
      })

    } catch (err) {
      console.error(err)

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }

  static async removeMember(req, res) {
    try {
      const { teamId, userId } = req.params
      const managerId = req.user.id

      const team = await TeamModel.getById(teamId)

      if (!team) {
        return res.status(404).json({
          error: 'Team not found'
        })
      }

      if (!isTeamManager(team, managerId)) {
        return res.status(403).json({
          error: 'Only the team manager can remove members'
        })
      }

      const user = await getTeamMember(userId, teamId)

      if (!user) {
        return res.status(404).json({
          error: 'User is not a member of this team'
        })
      }

      if (userId === managerId) {
        return res.status(400).json({
          error: 'Team manager cannot be removed'
        })
      }

      await TeamModel.removeMemberFromTeam(teamId, userId)

      return res.status(200).json({
        message: 'Member removed successfully'
      })

    } catch (err) {
      console.error(err)

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }

  static async updateMemberRole(req, res) {
    try {
      const { teamId, userId } = req.params
      const { role } = req.body
      const managerId = req.user.id

      const team = await TeamModel.getById(teamId)

      if (!team) {
        return res.status(404).json({
          error: 'Team not found'
        })
      }

      if (!isTeamManager(team, managerId)) {
        return res.status(403).json({
          error: 'Only the team manager can update member roles'
        })
      }

      if (userId === managerId) {
        return res.status(400).json({
          error: 'Team manager role cannot be changed'
        })
      }

      const allowedRoles = ['MEMBER']

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          error: 'Invalid role'
        })
      }

      const user = await getTeamMember(userId, teamId)

      if (!user) {
        return res.status(404).json({
          error: 'User is not a member of this team'
        })
      }

      const updatedUser = await TeamModel.updateMemberRole(
        userId,
        role
      )

      return res.status(200).json({
        message: 'Member role updated successfully',
        user: updatedUser
      })

    } catch (err) {
      console.error(err)

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }

  static async update(req, res) {
    try {
      const { teamId } = req.params
      const userId = req.user.id

      const { name } = updateTeamSchema.parse(req.body)

      const team = await TeamModel.getById(teamId)

      if (!team) {
        return res.status(404).json({
          error: 'Team not found'
        })
      }

      const user = await getTeamMember(userId, teamId)

      if (!user) {
        return res.status(403).json({
          error: 'You do not belong to this team'
        })
      }

      if (!isTeamManager(team, userId)) {
        return res.status(403).json({
          error: 'Only the team manager can update it'
        })
      }

      const updatedTeam = await TeamModel.update(teamId, { name })

      return res.status(200).json(updatedTeam)

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

  static async delete(req, res) {
    try {
      const { teamId } = req.params
      const userId = req.user.id

      const team = await TeamModel.getById(teamId)

      if (!team) {
        return res.status(404).json({
          error: 'Team not found'
        })
      }

      if (!isTeamManager(team, userId)) {
        return res.status(403).json({
          error: 'Only the team manager can delete the team'
        })
      }

      await TeamModel.deleteTeam(teamId)

      return res.status(200).json({
        message: 'Team deleted successfully'
      })

    } catch (err) {
      console.error(err)

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }

}