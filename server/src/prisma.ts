import { PrismaClient } from '.prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// 创建 PostgreSQL 连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// 创建 Prisma adapter
const adapter = new PrismaPg(pool);

// 使用 adapter 初始化 PrismaClient
const prisma = new PrismaClient({ adapter });

export default prisma;

