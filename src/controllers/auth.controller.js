import bcrypt from 'bcrypt'
import { UserModel } from '../models/user.model.js'
import { generateToken } from '../utils/jwt.js'
import { sanitizeUser } from '../utils/user.js'

export class AuthController {

  static async register(req, res) {
    try {
      const { username, email, password } = req.body

      // 1. comprobar si existe usuario
      const existingUser = await UserModel.getByEmail(email)
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' })
      }

      // 2. hashear password
      const passwordHash = await bcrypt.hash(password, 10)

      // 3. crear usuario
      const user = await UserModel.create({
        username,
        email,
        passwordHash
      })

      // 4. respuesta sin password
      return res.status(201).json(sanitizeUser(user))

    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body

      // 1. buscar usuario
      const user = await UserModel.getByEmail(email)
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' })
      }

      // 2. comparar password
      const isValid = await bcrypt.compare(password, user.passwordHash)
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid credentials' })
      }

      // 3. generar token
      const token = generateToken(user)

      // 4. devolver token
      return res.json({ token })

    } catch (err) {
  console.error("ERROR EN LOGIN:", err)

  return res.status(500).json({
    error: 'Internal server error'
  })
}
  }

  static async me(req, res) {
  try {
    const user = await UserModel.getById(req.user.id)

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    return res.status(200).json(sanitizeUser(user))

  } catch (err) {
    console.error(err)

    return res.status(500).json({
      error: 'Internal server error'
    })
  }
}
}