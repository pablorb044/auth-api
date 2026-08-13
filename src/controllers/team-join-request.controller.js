import { createJoinRequestSchema } from '../schemas/create-join-request.schema.js'
import { TeamModel } from '../models/team.model.js'
import { TeamJoinRequestModel } from '../models/team-join-request.model.js'
import { UserModel } from '../models/user.model.js'


export class TeamJoinRequestController {

  static async create(req, res) {
    try {
      const { teamId } = createJoinRequestSchema.parse(req.body)

      const userId = req.user.id

      // 1. Comprobar que el Team existe
      const team = await TeamModel.getById(teamId)

      if (!team) {
        return res.status(404).json({
          error: 'Team not found'
        })
      }

      // 2. Comprobar que el usuario no pertenece ya al Team
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

      // 3. Comprobar que no existe una solicitud pendiente
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

      // 4. Crear solicitud
      const joinRequest = await TeamJoinRequestModel.create({
        userId,
        teamId
      })

      // 5. Respuesta
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

}