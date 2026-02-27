const express = require('express');

const router = express.Router();

// GET /api/modes - List all modes
router.get('/', async (req, res) => {
    try {
        const modes = await req.prisma.mode.findMany({
            orderBy: { id: 'asc' }
        });
        res.json(modes);
    } catch (error) {
        console.error('Get modes error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/modes - Create a mode
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Mode name is required' });
        }

        const mode = await req.prisma.mode.upsert({
            where: { name },
            update: {},
            create: { name }
        });

        res.status(201).json(mode);
    } catch (error) {
        console.error('Create mode error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/modes/seed - Seed default modes
router.post('/seed', async (req, res) => {
    try {
        const modes = ['encode', 'decode'];

        for (const name of modes) {
            await req.prisma.mode.upsert({
                where: { name },
                update: {},
                create: { name }
            });
        }

        const allModes = await req.prisma.mode.findMany();
        res.json({ message: `Seeded ${modes.length} modes`, modes: allModes });
    } catch (error) {
        console.error('Seed modes error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
