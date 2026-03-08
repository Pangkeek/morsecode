require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('--- Testing Login Route Prisma Query ---');
  try {
      const username = 'boss';
      const user = await prisma.user.findFirst({
          where: {
              OR: [
                  { username },
                  { email: username }
              ]
          },
          include: { settings: true }
      });
      console.log('User found:', user ? user.username : 'Not found');
  } catch (err) {
      console.error('Prisma Error:', err);
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
