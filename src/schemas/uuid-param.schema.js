import { z } from 'zod'

export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid id')
})