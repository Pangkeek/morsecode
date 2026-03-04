require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndMakeAdmin() {
    try {
        let user = await prisma.user.findFirst({
            where: { username: { contains: 'BossZY', mode: 'insensitive' } }
        });

        if (!user) {
            user = await prisma.user.findFirst();
        }

        if (user) {
            console.log('Current user:', user.username, 'Role:', user.role);
            if (user.role !== 'ADMIN') {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { role: 'ADMIN' }
                });
                console.log('Updated to ADMIN:', user.username);
            }
        } else {
            console.log('No user found to make admin!');
        }
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAndMakeAdmin();
