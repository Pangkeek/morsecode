require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('--- Mock Data Verification ---');
  console.log('Users:', await prisma.user.count());
  console.log('Settings:', await prisma.settings.count());
  console.log('Play Sessions:', await prisma.playSession.count());
  console.log('User Mode Statuses:', await prisma.userModeStatus.count());

  // Show top 3 by rank/score to ensure leaderboard works
  console.log('--- Top 3 Users ---');
  const topUsers = await prisma.user.findMany({
    orderBy: { avgWpm: 'desc' },
    take: 3,
    include: { modeStatuses: true }
  });
  
  topUsers.forEach(u => {
      console.log(`${u.username} | Avg WPM: ${Math.round(u.avgWpm)} | Avg Acc: ${Math.round(u.avgAccuracy)}% | Total Sessions: ${u.totalPlay}`);
  });

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
