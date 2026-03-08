require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Generating realistic mistake data for "Most Failed Characters" chart...');

  try {
    const playSessions = await prisma.playSession.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: { symbol: true } // Include the symbol relation to know which symbol caused the mistake
    });

    if (playSessions.length === 0) {
      console.log('No play sessions found. Cannot generate mistakes.');
      return;
    }

    const commonMistakes = [
      { char: 'a', weight: 5 }, { char: 'e', weight: 8 }, { char: 'i', weight: 6 },
      { char: 'o', weight: 7 }, { char: 'u', weight: 4 }, { char: 'r', weight: 3 },
      { char: 's', weight: 6 }, { char: 't', weight: 5 }, { char: '.', weight: 9 },
      { char: '-', weight: 8 }, { char: 'x', weight: 2 }, { char: 'y', weight: 3 },
      { char: 'z', weight: 2 }
    ];

    let mistakesCreated = 0;

    for (const session of playSessions) {
      // Create 2-8 mistakes per session
      const numMistakes = Math.floor(Math.random() * 7) + 2;
      
      for (let i = 0; i < numMistakes; i++) {
        // Pick a character based roughly on weight
        const rand = Math.random() * 68; // Sum of weights approx
        let accumulator = 0;
        let selectedChar = 'a';
        
        for (const mw of commonMistakes) {
          accumulator += mw.weight;
          if (rand <= accumulator) {
            selectedChar = mw.char;
            break;
          }
        }

        await prisma.sessionDetail.create({
          data: {
            session: {
                connect: { id: session.id }
            },
            symbol: {
                connect: { id: session.symbolId }
            },
            question: selectedChar,
            correctAnswer: selectedChar,
            userAnswer: 'wrong_answer',
            isCorrect: false,
            timeTaken: Math.floor(Math.random() * 3000) + 500 // 500ms to 3.5s
          }
        });
        mistakesCreated++;
      }
    }

    console.log(`Successfully generated ${mistakesCreated} mock mistakes across ${playSessions.length} play sessions!`);
  } catch (err) {
    console.error('Error generating mistakes:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error);
