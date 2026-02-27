const express = require('express');

const router = express.Router();

// GET /api/difficulties - List all difficulties
router.get('/', async (req, res) => {
    try {
        const difficulties = await req.prisma.difficulty.findMany({
            orderBy: { id: 'asc' }
        });
        res.json(difficulties);
    } catch (error) {
        console.error('Get difficulties error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/difficulties - Create a difficulty
router.post('/', async (req, res) => {
    try {
        const { name, amtWord } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Difficulty name is required' });
        }

        const difficulty = await req.prisma.difficulty.upsert({
            where: { name },
            update: { amtWord: amtWord || 10 },
            create: { name, amtWord: amtWord || 10 }
        });

        res.status(201).json(difficulty);
    } catch (error) {
        console.error('Create difficulty error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/difficulties/seed - Seed default difficulties
router.post('/seed', async (req, res) => {
    try {
        const difficulties = [
            { name: 'easy', amtWord: 10 },
            { name: 'medium', amtWord: 15 },
            { name: 'hard', amtWord: 50 }
        ];

        for (const diff of difficulties) {
            await req.prisma.difficulty.upsert({
                where: { name: diff.name },
                update: { amtWord: diff.amtWord },
                create: diff
            });
        }

        const allDifficulties = await req.prisma.difficulty.findMany();
        res.json({ message: `Seeded ${difficulties.length} difficulties`, difficulties: allDifficulties });
    } catch (error) {
        console.error('Seed difficulties error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
