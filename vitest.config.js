import { defineConfig } from 'vitest/config'

process.env.PRISMA_SCHEMA = 'neo_test'

export default defineConfig({
  test: {
    fileParallelism: false
  }
})