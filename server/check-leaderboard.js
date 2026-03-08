require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('--- Checking UserModeStatus Combinations ---');
  const statuses = await prisma.userModeStatus.findMany({
    include: {
      mode: true,
      symbol: true,
      difficulty: true,
      user: true
    },
    take: 10
  });

  statuses.forEach(s => {
      console.log(`User: ${s.user.username} | Mode: ${s.mode.name} | Symbol: ${s.symbol.name} | Diff(amtWord): ${s.difficulty.name}(${s.difficulty.amtWord}) | WPM: ${s.highWpm}`);
  });

  const decodeAz10 = await prisma.userModeStatus.count({
    where: {
        mode: { name: 'decode' },
        symbol: { name: 'a-z' },
        difficulty: { amtWord: 10 }
    }
  });

  console.log(`\nTotal mock records for decode | a-z | 10: ${decodeAz10}`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
