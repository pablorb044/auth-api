import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const schema = process.env.PRISMA_SCHEMA || 'public'
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined')
}

const url = new URL(databaseUrl)

url.searchParams.set('schema', schema)

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations'
  },
  datasource: {
    url: url.toString()
  }
})