require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('--- Leaderboard API Simulation ---');
  
  const modeRecord = await prisma.mode.findUnique({ where: { name: 'decode' } });
  const symbolRecord = await prisma.symbol.findUnique({ where: { name: 'a-z' } });
  const difficultyRecord = await prisma.difficulty.findFirst({ where: { amtWord: 10 } });

  const statuses = await prisma.userModeStatus.findMany({
      where: {
          modeId: modeRecord.id,
          symbolId: symbolRecord.id,
          difficultyId: difficultyRecord.id,
      },
      include: {
          user: {
              select: {
                  id: true,
                  username: true,
              }
          }
      },
      orderBy: [
          { highWpm: 'desc' },
          { highAccuracy: 'desc' }
      ],
      take: 50
  });

  const leaderboard = statuses.map((s, index) => ({
      username: s.user.username,
      rank: index + 1,
      highWpm: s.highWpm,
      highAccuracy: s.highAccuracy
  }));

  console.log(leaderboard);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
