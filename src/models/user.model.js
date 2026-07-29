import crypto from 'node:crypto'

const users = []

export class UserModel {
  static async create({ username, email, passwordHash }) {
    const newUser = {
      id: crypto.randomUUID(),
      username,
      email,
      passwordHash,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    }

    users.push(newUser)
    return newUser
  }

  static async getByEmail(email) {
    return users.find(user => user.email === email)
  }

  static async getById(id) {
    return users.find(user => user.id === id)
  }
}