export function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    teamId: user.teamId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isActive: user.isActive
  }
}