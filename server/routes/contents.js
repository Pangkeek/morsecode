const express = require('express');

const router = express.Router();

// GET /api/contents - List/filter contents
router.get('/', async (req, res) => {
    try {
        const { modeId, difficultyId, symbolId } = req.query;

        const where = {};
        if (modeId) where.modeId = parseInt(modeId);
        if (difficultyId) where.difficultyId = parseInt(difficultyId);
        if (symbolId) where.symbolId = parseInt(symbolId);

        const contents = await req.prisma.content.findMany({
            where,
            include: {
                mode: true,
                difficulty: true,
                symbol: true
            }
        });

        res.json(contents);
    } catch (error) {
        console.error('Get contents error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/contents/:modeId/:difficultyId/:symbolId - Get specific content
router.get('/:modeId/:difficultyId/:symbolId', async (req, res) => {
    try {
        const { modeId, difficultyId, symbolId } = req.params;

        const content = await req.prisma.content.findUnique({
            where: {
                modeId_difficultyId_symbolId: {
                    modeId: parseInt(modeId),
                    difficultyId: parseInt(difficultyId),
                    symbolId: parseInt(symbolId)
                }
            },
            include: {
                mode: true,
                difficulty: true,
                symbol: true
            }
        });

        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }

        res.json(content);
    } catch (error) {
        console.error('Get specific content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/contents - Create or update content
router.post('/', async (req, res) => {
    try {
        const { modeId, difficultyId, symbolId, content: contentText } = req.body;

        if (!modeId || !difficultyId || !symbolId || !contentText) {
            return res.status(400).json({ error: 'modeId, difficultyId, symbolId, and content are required' });
        }

        const content = await req.prisma.content.upsert({
            where: {
                modeId_difficultyId_symbolId: {
                    modeId: parseInt(modeId),
                    difficultyId: parseInt(difficultyId),
                    symbolId: parseInt(symbolId)
                }
            },
            update: { content: contentText },
            create: {
                modeId: parseInt(modeId),
                difficultyId: parseInt(difficultyId),
                symbolId: parseInt(symbolId),
                content: contentText
            }
        });

        res.status(201).json(content);
    } catch (error) {
        console.error('Create content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
