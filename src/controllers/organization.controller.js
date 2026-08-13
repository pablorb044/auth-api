import { createOrganizationSchema } from '../schemas/create-organization.schema.js'
import { OrganizationModel } from '../models/organization.model.js'

export class OrganizationController {

  static async create(req, res) {
    try {
      const { organizationName, teamName } =
        createOrganizationSchema.parse(req.body)

      const result = await OrganizationModel.createWithTeam({
        organizationName,
        teamName,
        managerId: req.user.id
      })

      return res.status(201).json({
        organization: result.organization,
        team: result.team,
        manager: {
          id: result.manager.id,
          username: result.manager.username,
          email: result.manager.email,
          role: result.manager.role
        }
      })

    } catch (err) {

      if (err.name === 'ZodError') {
        return res.status(400).json({
          errors: err.issues
        })
      }

      if (err.code === 'P2002') {
        return res.status(400).json({
          error: 'Organization or manager already has a team'
        })
      }

      console.error(err)

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }

}