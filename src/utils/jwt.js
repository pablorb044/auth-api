import jwt from 'jsonwebtoken'


export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}