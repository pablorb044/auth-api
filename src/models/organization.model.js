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

  static async getWithTeam(organizationId) {
    return prisma.organization.findUnique({
      where: {
        id: organizationId
      },
      include: {
        team: {
          include: {
            manager: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    })
  }

  static async getMembers(organizationId) {
    return prisma.user.findMany({
      where: {
        team: {
          organizationId
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
  }

  static async getUserOrganization(userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        team: {
          select: {
            organizationId: true
          }
        }
      }
    })

    if (!user) {
      return null
    }

    return {
      ...user,
      organizationId: user.team?.organizationId ?? null
    }
  }

  static async update(id, { name }) {
    return prisma.organization.update({
      where: {
        id
      },
      data: {
        name
      }
    })
  }

}