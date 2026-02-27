const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function debugData() {
    try {
        const modes = await prisma.mode.findMany();
        const symbols = await prisma.symbol.findMany();
        const diffs = await prisma.difficulty.findMany();
        const sessions = await prisma.playSession.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });

        console.log('--- Database Mapping ---');
        console.log('Modes:', modes);
        console.log('Symbols:', symbols);
        console.log('Difficulties:', diffs);
        console.log('--- Recent Sessions ---');
        console.log(JSON.stringify(sessions, null, 2));

    } catch (err) {
        console.error('Debug failed:', err);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

debugData();
