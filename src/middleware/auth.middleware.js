import { verifyToken } from '../utils/jwt.js'

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    // 1. comprobar que existe header
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // 2. separar "Bearer token"
    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' })
    }

    // 3. verificar token
    const decoded = verifyToken(token)

    // 4. guardar usuario en request
    req.user = decoded

    // 5. continuar
    next()

  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}