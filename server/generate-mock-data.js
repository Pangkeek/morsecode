require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

let prisma;

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });

  console.log('Starting mock data generation...');

  // 1. Fetch necessary lookup tables to connect
  const modes = await prisma.mode.findMany();
  const difficulties = await prisma.difficulty.findMany();
  const symbols = await prisma.symbol.findMany();

  if (!modes.length || !difficulties.length || !symbols.length) {
    console.log('Error: Run database seed first to populate Modes, Difficulties, and Symbols.');
    process.exit(1);
  }

  // Helper function for random dates within last 30 days
  const getRandomDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
    return date;
  };

  // 2. Create 30 Fake Users
  const userPrefixes = ['Pro', 'Master', 'Noob', 'Speedy', 'Silent', 'Echo', 'Dash', 'Dot', 'Radio', 'Signal'];
  const userSuffixes = ['Coder', 'Sender', 'Receiver', 'Fox', 'Wolf', 'Eagle', 'Hawk', 'Falcon', 'Owl'];
  
  const usersToCreate = [];
  const hashedPassword = await bcrypt.hash('password123', 10);

  for (let i = 0; i < 30; i++) {
    const prefix = userPrefixes[Math.floor(Math.random() * userPrefixes.length)];
    const suffix = userSuffixes[Math.floor(Math.random() * userSuffixes.length)];
    const randomNum = Math.floor(Math.random() * 899) + 100;
    const username = `${prefix}${suffix}${randomNum}_BOT`;
    const email = `${username.toLowerCase()}@example.com`;
    const skillLevel = Math.floor(Math.random() * 3); // 0: Beginner, 1: Int, 2: Expert

    usersToCreate.push({
      username,
      email,
      password: hashedPassword,
      role: 'USER',
      _skillLevel: skillLevel
    });
  }

  console.log('Inserting 30 mock users...');
  
  for (const u of usersToCreate) {
    let createdUser;
    try {
      createdUser = await prisma.user.create({
        data: {
          username: u.username,
          email: u.email,
          password: u.password,
          role: u.role
        }
      });
    } catch (e) {
      console.log(`Skipping duplicate or error for user: ${u.username}`);
      continue;
    }

    // Auto-create Settings (manual check to avoid upsert issues)
    const existingSettings = await prisma.settings.findUnique({ where: { userId: createdUser.id } });
    if (!existingSettings) {
      await prisma.settings.create({
        data: {
          userId: createdUser.id,
          theme: 'dark',
          soundVolume: 80,
          showHints: u._skillLevel === 0 ? true : false,
        }
      });
    }

    // 3. Generate Play Sessions
    const numSessions = Math.floor(Math.random() * 11) + 5; 
    let highestWpm = 0;
    let highestAccuracy = 0;
    let totalScore = 0;
    let totalTimeTaken = 0;

    for (let i = 0; i < numSessions; i++) {
        const _mode = modes[Math.floor(Math.random() * modes.length)];
        const _diff = difficulties[Math.floor(Math.random() * difficulties.length)];
        const _sym = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Base stats on skill level
        let baseWpm, baseAcc;
        if (u._skillLevel === 0) { // Beginner
            baseWpm = Math.floor(Math.random() * 10) + 5; 
            baseAcc = Math.floor(Math.random() * 20) + 40; 
        } else if (u._skillLevel === 1) { // Intermediate
            baseWpm = Math.floor(Math.random() * 15) + 15; 
            baseAcc = Math.floor(Math.random() * 25) + 60; 
        } else { // Expert
            baseWpm = Math.floor(Math.random() * 30) + 30; 
            baseAcc = Math.floor(Math.random() * 15) + 85; 
        }

        const sessionDate = getRandomDate();
        const timeTaken = Math.floor(Math.random() * 120) + 30; // 30s to 150s
        const score = Math.floor(baseWpm * (baseAcc/100) * 10);
        const mistakeCount = Math.floor((100 - baseAcc) / 5);

        highestWpm = Math.max(highestWpm, baseWpm);
        highestAccuracy = Math.max(highestAccuracy, baseAcc);
        totalScore += score;
        totalTimeTaken += timeTaken;

        await prisma.playSession.create({
            data: {
                userId: createdUser.id,
                modeId: _mode.id,
                difficultyId: _diff.id,
                symbolId: _sym.id,
                wpm: baseWpm,
                accuracy: baseAcc,
                mistakeCount: mistakeCount,
                timeTaken: timeTaken,
                createdAt: sessionDate
            }
        });

        // Upsert UserModeStatus for the leaderboard accumulation
        await prisma.userModeStatus.upsert({
          where: {
            userId_modeId_difficultyId_symbolId: {
              userId: createdUser.id,
              modeId: _mode.id,
              difficultyId: _diff.id,
              symbolId: _sym.id
            }
          },
          update: {
            highWpm: { set: Math.max(highestWpm, baseWpm) },
            highAccuracy: { set: Math.max(highestAccuracy, baseAcc) },
            totalScore: { increment: score },
            mistakeCount: { increment: mistakeCount },
            time: { increment: timeTaken },
            realTime: { increment: timeTaken }
          },
          create: {
            userId: createdUser.id,
            modeId: _mode.id,
            difficultyId: _diff.id,
            symbolId: _sym.id,
            highWpm: baseWpm,
            highAccuracy: baseAcc,
            totalScore: score,
            mistakeCount: mistakeCount,
            time: timeTaken,
            realTime: timeTaken
          }
        });
    }

    // 4. Update User aggregations (totalPlay, avgWpm, avgAccuracy)
    // First, let's calculate real averages from user mode statuses
    const userStats = await prisma.userModeStatus.findMany({ where: { userId: createdUser.id }});
    
    let avgWpmAgg = 0;
    let avgAccAgg = 0;
    if (userStats.length > 0) {
      avgWpmAgg = userStats.reduce((acc, curr) => acc + curr.highWpm, 0) / userStats.length;
      avgAccAgg = userStats.reduce((acc, curr) => acc + curr.highAccuracy, 0) / userStats.length;
    }

    await prisma.user.update({
        where: { id: createdUser.id },
        data: {
            totalPlay: numSessions,
            avgWpm: avgWpmAgg,
            avgAccuracy: avgAccAgg
        }
    });

  }

  console.log('Mock data generation complete! 🎉');
  
  await prisma.$disconnect();
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  if (prisma) await prisma.$disconnect();
  process.exit(1);
});
