import { TeamModel } from '../models/team.model.js'
import { UserModel } from '../models/user.model.js'

export class TeamController {

  static async getTeam(req, res) {
    try {
      const { teamId } = req.params
      const userId = req.user.id

      const team = await TeamModel.getWithManager(teamId)

      if (!team) {
        return res.status(404).json({
          error: 'Team not found'
        })
      }

      const user = await UserModel.getById(userId)

      if (!user || user.teamId !== teamId) {
        return res.status(403).json({
          error: 'You do not belong to this team'
        })
      }

      return res.status(200).json(team)

    } catch (err) {
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

      const user = await UserModel.getById(userId)

      if (!user || user.teamId !== teamId) {
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

    const user = await UserModel.getById(userId)

    if (!user || user.teamId !== teamId) {
      return res.status(403).json({
        error: 'You do not belong to this team'
      })
    }

    if (team.managerId === userId) {
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

    if (team.managerId !== managerId) {
      return res.status(403).json({
        error: 'Only the team manager can remove members'
      })
    }

    const user = await UserModel.getById(userId)

    if (!user || user.teamId !== teamId) {
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

    if (team.managerId !== managerId) {
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

    const user = await UserModel.getById(userId)

    if (!user || user.teamId !== teamId) {
      return res.status(404).json({
        error: 'User is not a member of this team'
      })
    }

    const updatedUser = await TeamModel.updateMemberRole(userId, role)

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

}