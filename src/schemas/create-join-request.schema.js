import { z } from 'zod'

export const createJoinRequestSchema = z.object({
  teamId: z
    .string()
    .uuid('Invalid team id')
})