const express = require('express');

const router = express.Router();

// GET /api/symbols - List all symbols
router.get('/', async (req, res) => {
    try {
        const symbols = await req.prisma.symbol.findMany({
            orderBy: { id: 'asc' }
        });
        res.json(symbols);
    } catch (error) {
        console.error('Get symbols error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/symbols - Create a symbol
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Symbol name is required' });
        }

        const symbol = await req.prisma.symbol.upsert({
            where: { name },
            update: {},
            create: { name }
        });

        res.status(201).json(symbol);
    } catch (error) {
        console.error('Create symbol error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/symbols/seed - Seed default symbols
router.post('/seed', async (req, res) => {
    try {
        const symbols = ['a-z', 'word'];

        for (const name of symbols) {
            await req.prisma.symbol.upsert({
                where: { name },
                update: {},
                create: { name }
            });
        }

        const allSymbols = await req.prisma.symbol.findMany();
        res.json({ message: `Seeded ${symbols.length} symbols`, symbols: allSymbols });
    } catch (error) {
        console.error('Seed symbols error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
