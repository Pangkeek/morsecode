const express = require('express');
const { authenticateToken } = require('./auth.js');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/user-mode-status - Get all stats for current user
router.get('/', async (req, res) => {
    try {
        const { modeId, difficultyId, symbolId } = req.query;

        const where = { userId: req.user.id };
        if (modeId) where.modeId = parseInt(modeId);
        if (difficultyId) where.difficultyId = parseInt(difficultyId);
        if (symbolId) where.symbolId = parseInt(symbolId);

        const statuses = await req.prisma.userModeStatus.findMany({
            where,
            include: {
                mode: true,
                difficulty: true,
                symbol: true
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json(statuses);
    } catch (error) {
        console.error('Get user mode status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/user-mode-status/:modeId/:difficultyId/:symbolId - Get specific stat
router.get('/:modeId/:difficultyId/:symbolId', async (req, res) => {
    try {
        const { modeId, difficultyId, symbolId } = req.params;

        const status = await req.prisma.userModeStatus.findUnique({
            where: {
                userId_modeId_difficultyId_symbolId: {
                    userId: req.user.id,
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

        if (!status) {
            return res.status(404).json({ error: 'No statistics found for this combination' });
        }

        res.json(status);
    } catch (error) {
        console.error('Get specific user mode status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/user-mode-status/summary - Get aggregated summary
router.get('/summary/overview', async (req, res) => {
    try {
        const statuses = await req.prisma.userModeStatus.findMany({
            where: { userId: req.user.id },
            include: {
                mode: true,
                difficulty: true,
                symbol: true
            }
        });

        if (statuses.length === 0) {
            return res.json({
                totalCombinations: 0,
                overallHighWpm: 0,
                overallHighAccuracy: 0,
                totalMistakes: 0,
                totalTime: 0,
                byMode: {},
                byDifficulty: {}
            });
        }

        // Aggregate by mode
        const byMode = {};
        const byDifficulty = {};

        for (const status of statuses) {
            const modeName = status.mode.name;
            if (!byMode[modeName]) {
                byMode[modeName] = { highWpm: 0, highAccuracy: 0, totalTime: 0, count: 0 };
            }
            byMode[modeName].highWpm = Math.max(byMode[modeName].highWpm, status.highWpm);
            byMode[modeName].highAccuracy = Math.max(byMode[modeName].highAccuracy, status.highAccuracy);
            byMode[modeName].totalTime += status.time;
            byMode[modeName].count++;

            const diffName = status.difficulty.name;
            if (!byDifficulty[diffName]) {
                byDifficulty[diffName] = { highWpm: 0, highAccuracy: 0, totalTime: 0, count: 0 };
            }
            byDifficulty[diffName].highWpm = Math.max(byDifficulty[diffName].highWpm, status.highWpm);
            byDifficulty[diffName].highAccuracy = Math.max(byDifficulty[diffName].highAccuracy, status.highAccuracy);
            byDifficulty[diffName].totalTime += status.time;
            byDifficulty[diffName].count++;
        }

        res.json({
            totalCombinations: statuses.length,
            overallHighWpm: Math.max(...statuses.map(s => s.highWpm)),
            overallHighAccuracy: Math.max(...statuses.map(s => s.highAccuracy)),
            totalMistakes: statuses.reduce((sum, s) => sum + s.mistakeCount, 0),
            totalTime: statuses.reduce((sum, s) => sum + s.time, 0),
            byMode,
            byDifficulty
        });
    } catch (error) {
        console.error('Get user mode status summary error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
