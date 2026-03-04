require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const adminUsername = 'admin_test';
        const adminPassword = 'password123';
        const adminEmail = 'admin@example.com';

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        let user = await prisma.user.findUnique({
            where: { username: adminUsername }
        });

        if (user) {
            // Update existing
            user = await prisma.user.update({
                where: { id: user.id },
                data: { role: 'ADMIN', password: hashedPassword }
            });
            console.log('✅ Updated existing user to ADMIN.');
        } else {
            // Create new
            user = await prisma.user.create({
                data: {
                    username: adminUsername,
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN',
                    settings: {
                        create: { theme: 'dark' }
                    }
                }
            });
            console.log('✅ Created new ADMIN user successfully.');
        }

        console.log('\n--- ADMIN CREDENTIALS ---');
        console.log('Username: ', adminUsername);
        console.log('Password: ', adminPassword);
        console.log('Role:     ', user.role);
        console.log('-------------------------');

    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
