require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          endsWith: '_BOT'
        }
      }
    });

    console.log(`Found ${users.length} users with _BOT suffix. Updating...`);

    let updateCount = 0;
    for (const user of users) {
      const newUsername = user.username.replace('_BOT', '');
      await prisma.user.update({
        where: { id: user.id },
        data: { username: newUsername }
      });
      updateCount++;
    }

    console.log(`Successfully updated ${updateCount} users.`);
  } catch (err) {
    console.error('Error updating users:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error);
