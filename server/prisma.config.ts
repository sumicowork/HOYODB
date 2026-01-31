import * as path from 'path'
import { defineConfig } from 'prisma/config'

// 加载环境变量
import 'dotenv/config'

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),

  // 数据库连接配置
  datasource: {
    url: process.env.DATABASE_URL!,
  },

  // 迁移配置
  migrate: {
    adapter: async () => {
      const { Pool } = await import('pg')
      const { PrismaPg } = await import('@prisma/adapter-pg')

      const pool = new Pool({
        connectionString: process.env.DATABASE_URL
      })

      return new PrismaPg(pool)
    }
  },

  // 种子数据配置
  migrations: {
    seed: 'npx ts-node prisma/seed.ts',
  },
})

