import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(2, 'Task title must be at least 2 characters'),

  description: z
    .string()
    .optional(),

  assignedToId: z
    .string()
    .uuid('Assigned user ID must be a valid UUID')
})