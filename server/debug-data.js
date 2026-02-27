const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function debugWeakness() {
    const userId = 1; // Testing for user 1
    try {
        const mistakes = await prisma.sessionDetail.findMany({
            where: {
                playSession: {
                    userId: userId
                },
                isCorrect: false
            },
            select: {
                question: true,
                correctAnswer: true
            }
        });

        console.log(`--- Mistakes for User ${userId} ---`);
        console.log('Count:', mistakes.length);

        const charCounts = {};
        mistakes.forEach(m => {
            const char = m.correctAnswer || m.question;
            if (char) {
                charCounts[char] = (charCounts[char] || 0) + 1;
            }
        });

        const sorted = Object.entries(charCounts)
            .map(([character, errorCount]) => ({ character, errorCount }))
            .sort((a, b) => b.errorCount - a.errorCount)
            .slice(0, 5);

        console.log('Aggregation (Top 5):', sorted);

    } catch (err) {
        console.error('Debug failed:', err);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

debugWeakness();
