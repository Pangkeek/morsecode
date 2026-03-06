require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function main() {
    console.log('Starting export...');

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        console.log('Fetching users...');
        const users = await prisma.user.findMany();

        console.log('Fetching data...');
        const data = {
            users: users,
            settings: await prisma.settings.findMany(),
            modes: await prisma.mode.findMany(),
            symbols: await prisma.symbol.findMany(),
            difficulties: await prisma.difficulty.findMany(),
            playSessions: await prisma.playSession.findMany(),
            sessionDetails: await prisma.sessionDetail.findMany(),
            userModeStatuses: await prisma.userModeStatus.findMany(),
            contents: await prisma.content.findMany(),
        };

        fs.writeFileSync('database_export.json', JSON.stringify(data, null, 2));
        console.log('Export successful! Data saved to database_export.json');
    } catch (error) {
        console.error('Error exporting database:');
        console.error(error.message);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main().catch(e => {
    console.error('Unhandled error:', e.message);
    process.exit(1);
});
