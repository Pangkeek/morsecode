require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Resetting sequences...');
  
  const tables = [
    'User',
    'Settings',
    'Mode',
    'Symbol',
    'Difficulty',
    'PlaySession',
    'SessionDetail',
    'UserModeStatus',
    'Content'
  ];

  for (const table of tables) {
    try {
      // Find the max ID
      const result = await prisma.$queryRawUnsafe(`SELECT COALESCE(MAX(id), 0) as max_id FROM "${table}";`);
      const maxId = Number(result[0].max_id);
      
      // Set the sequence to maxId + 1
      await prisma.$queryRawUnsafe(`SELECT setval('"${table}_id_seq"', ${maxId > 0 ? maxId : 1}, ${maxId > 0});`);
      console.log(`Reset ${table} sequence to ${maxId + 1}`);
    } catch (e) {
      console.log(`Skipped or Error on ${table}:`, e.message);
    }
  }

  console.log('Sequences reset successfully!');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
