const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
    try {
        console.log('Seeding Modes...');
        await prisma.mode.upsert({ where: { name: 'encode' }, update: {}, create: { name: 'encode' } });
        await prisma.mode.upsert({ where: { name: 'decode' }, update: {}, create: { name: 'decode' } });

        console.log('Seeding Symbols...');
        await prisma.symbol.upsert({ where: { name: 'a-z' }, update: {}, create: { name: 'a-z' } });
        await prisma.symbol.upsert({ where: { name: 'word' }, update: {}, create: { name: 'word' } });

        console.log('Seeding Difficulties...');
        const diffs = [
            { name: 'easy', amtWord: 10 },
            { name: 'medium', amtWord: 15 },
            { name: 'hard', amtWord: 50 },
            { name: 'expert', amtWord: 100 }
        ];
        for (const d of diffs) {
            await prisma.difficulty.upsert({ where: { name: d.name }, update: { amtWord: d.amtWord }, create: d });
        }

        console.log('Seeding successful!');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

seed();
