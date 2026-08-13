import { prisma } from '../lib/prisma.js'

export class TeamJoinRequestModel {

  static async create({ userId, teamId }) {
    return prisma.teamJoinRequest.create({
      data: {
        userId,
        teamId
      }
    })
  }

  static async getById(id) {
    return prisma.teamJoinRequest.findUnique({
      where: {
        id
      }
    })
  }

  static async getByUserAndTeam(userId, teamId) {
    return prisma.teamJoinRequest.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId
        }
      }
    })
  }

  static async getPendingByUserAndTeam(userId, teamId) {
    return prisma.teamJoinRequest.findFirst({
      where: {
        userId,
        teamId,
        status: 'pending'
      }
    })
  }

  static async getPendingByTeam(teamId) {
    return prisma.teamJoinRequest.findMany({
      where: {
        teamId,
        status: 'pending'
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
  }

  static async updateStatus(id, status) {
    return prisma.teamJoinRequest.update({
      where: {
        id
      },
      data: {
        status
      }
    })
  }

}