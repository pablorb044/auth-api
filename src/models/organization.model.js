import { prisma } from '../lib/prisma.js'

export class OrganizationModel {

  static async create({ name }) {
    return prisma.organization.create({
      data: {
        name
      }
    })
  }

  static async getById(id) {
    return prisma.organization.findUnique({
      where: {
        id
      }
    })
  }

  static async getByName(name) {
    return prisma.organization.findFirst({
      where: {
        name
      }
    })
  }

  static async createWithTeam({ organizationName, teamName, managerId }) {
    return prisma.$transaction(async (tx) => {

      const organization = await tx.organization.create({
        data: {
          name: organizationName
        }
      })

      const team = await tx.team.create({
        data: {
          name: teamName,
          organizationId: organization.id,
          managerId
        }
      })

      const manager = await tx.user.update({
        where: {
          id: managerId
        },
        data: {
          role: 'manager',
          teamId: team.id
        }
      })

      return {
        organization,
        team,
        manager
      }
    })
  }

}