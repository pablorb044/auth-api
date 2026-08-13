import { z } from 'zod'

export const createOrganizationSchema = z.object({
  organizationName: z
    .string()
    .min(2, 'Organization name must be at least 2 characters'),

  teamName: z
    .string()
    .min(2, 'Team name must be at least 2 characters')
})