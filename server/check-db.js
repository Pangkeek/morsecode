require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const count = await prisma.user.count();
    console.log('Total Users in new DB:', count);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error);
