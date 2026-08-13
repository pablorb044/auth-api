import { prisma } from '../lib/prisma.js'

export class TeamModel {

  static async create({ name, organizationId, managerId }) {
    return prisma.team.create({
      data: {
        name,
        organizationId,
        managerId
      }
    })
  }

  static async getById(id) {
    return prisma.team.findUnique({
      where: {
        id
      }
    })
  }

  static async getByOrganizationId(organizationId) {
    return prisma.team.findUnique({
      where: {
        organizationId
      }
    })
  }

  static async getByManagerId(managerId) {
    return prisma.team.findUnique({
      where: {
        managerId
      }
    })
  }

  static async addMember(teamId, userId) {
    return prisma.user.update({
      where: {
        id: userId
      },
      data: {
        teamId
      }
    })
  }

}