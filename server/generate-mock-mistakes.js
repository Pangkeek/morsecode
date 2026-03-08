require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Generating realistic mistake data for "Most Failed Characters" chart (BATCH MODE)...');

  try {
    const playSessions = await prisma.playSession.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' }
    });

    if (playSessions.length === 0) {
      console.log('No play sessions found. Cannot generate mistakes.');
      return;
    }

    const commonMistakes = [
      { char: 'A', weight: 5 }, { char: 'E', weight: 8 }, { char: 'I', weight: 6 },
      { char: 'O', weight: 7 }, { char: 'U', weight: 4 }, { char: 'R', weight: 3 },
      { char: 'S', weight: 6 }, { char: 'T', weight: 5 }, { char: '.', weight: 9 },
      { char: '-', weight: 8 }
    ];

    const mistakesToInsert = [];

    for (const session of playSessions) {
      // Create 2-8 mistakes per session
      const numMistakes = Math.floor(Math.random() * 7) + 2;
      
      for (let i = 0; i < numMistakes; i++) {
        // Pick a character based roughly on weight
        const rand = Math.random() * 61; // Sum of weights approx
        let accumulator = 0;
        let selectedChar = 'A';
        
        for (const mw of commonMistakes) {
          accumulator += mw.weight;
          if (rand <= accumulator) {
            selectedChar = mw.char;
            break;
          }
        }

        mistakesToInsert.push({
            sessionId: session.id,
            symbolId: session.symbolId,
            question: selectedChar,
            correctAnswer: selectedChar,
            userAnswer: 'wrong_answer',
            isCorrect: false,
            responseTime: Math.floor(Math.random() * 3000) + 500, // 500ms to 3.5s
            orderIndex: i + 1
        });
      }
    }

    console.log(`Inserting ${mistakesToInsert.length} mistake records...`);
    
    await prisma.sessionDetail.createMany({
        data: mistakesToInsert,
        skipDuplicates: true
    });

    console.log(`Successfully generated ${mistakesToInsert.length} mock mistakes across ${playSessions.length} play sessions!`);
  } catch (err) {
    console.error('Error generating mistakes:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error);
