import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const schema = process.env.PRISMA_SCHEMA || 'public'

const adapter = new PrismaPg(
  {
    connectionString: process.env.DATABASE_URL
  },
  {
    schema
  }
)

export const prisma = new PrismaClient({
  adapter
})