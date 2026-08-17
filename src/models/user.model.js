import { prisma } from '../lib/prisma.js'

export class UserModel {

  static async create({ username, email, passwordHash }) {
    return prisma.user.create({
      data: {
        username,
        email,
        passwordHash
      }
    })
  }

  static async getByEmail(email) {
    return prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  static async getById(id) {
    return prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  static async update(id, { username, email }) {
    return prisma.user.update({
      where: {
        id
      },
      data: {
        ...(username && { username }),
        ...(email && { email })
      }
    })
  }

  static async deactivate(id) {
    return prisma.user.update({
      where: {
        id
      },
      data: {
        isActive: false
      }
    })
  }

  static async existsByEmail(email) {
    const count = await prisma.user.count({
      where: {
        email
      }
    })

    return count > 0
  }

  static async getActiveById(id) {
    return prisma.user.findFirst({
      where: {
        id,
        isActive: true
      }
    })
  }

}