const express = require('express');
const { authenticateToken } = require('./auth.js');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/results - Get all results for current user
router.get('/', async (req, res) => {
    try {
        const results = await req.prisma.result.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        res.json(results);
    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/results - Save a new result
router.post('/', async (req, res) => {
    try {
        const { mode, letterMode, letterCount, accuracy, wpm, timeTaken } = req.body;

        // Validate input
        if (!mode || !letterMode || letterCount === undefined || accuracy === undefined || wpm === undefined || timeTaken === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const result = await req.prisma.result.create({
            data: {
                userId: req.user.id,
                mode,
                letterMode,
                letterCount,
                accuracy,
                wpm,
                timeTaken
            }
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Save result error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/results/stats - Get statistics for current user
router.get('/stats', async (req, res) => {
    try {
        const results = await req.prisma.result.findMany({
            where: { userId: req.user.id }
        });

        if (results.length === 0) {
            return res.json({
                totalGames: 0,
                avgAccuracy: 0,
                avgWpm: 0,
                bestWpm: 0,
                bestAccuracy: 0,
                totalTimePlayed: 0
            });
        }

        const totalGames = results.length;
        const avgAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / totalGames;
        const avgWpm = results.reduce((sum, r) => sum + r.wpm, 0) / totalGames;
        const bestWpm = Math.max(...results.map(r => r.wpm));
        const bestAccuracy = Math.max(...results.map(r => r.accuracy));
        const totalTimePlayed = results.reduce((sum, r) => sum + r.timeTaken, 0);

        res.json({
            totalGames,
            avgAccuracy: Math.round(avgAccuracy * 100) / 100,
            avgWpm: Math.round(avgWpm * 100) / 100,
            bestWpm,
            bestAccuracy,
            totalTimePlayed
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/results/stats/detailed - Get detailed statistics grouped by mode combination
router.get('/stats/detailed', async (req, res) => {
    try {
        const results = await req.prisma.result.findMany({
            where: { userId: req.user.id }
        });

        // Group results by mode_letterMode_letterCount
        const grouped = {};

        // Initialize all 16 possible combinations with empty stats
        const modes = ['encode', 'decode'];
        const letterModes = ['a-z', 'word'];
        const letterCounts = [10, 15, 50, 100];

        for (const mode of modes) {
            for (const letterMode of letterModes) {
                for (const letterCount of letterCounts) {
                    const key = `${mode}_${letterMode}_${letterCount}`;
                    grouped[key] = {
                        totalGames: 0,
                        avgWpm: 0,
                        bestWpm: 0,
                        avgAccuracy: 0,
                        bestAccuracy: 0,
                        totalTimePlayed: 0,
                        results: []
                    };
                }
            }
        }

        // Populate with actual results
        for (const result of results) {
            const key = `${result.mode}_${result.letterMode}_${result.letterCount}`;
            if (grouped[key]) {
                grouped[key].results.push(result);
            }
        }

        // Calculate stats for each group
        const detailedStats = {};
        for (const [key, data] of Object.entries(grouped)) {
            const { results: groupResults } = data;

            if (groupResults.length === 0) {
                detailedStats[key] = {
                    totalGames: 0,
                    avgWpm: 0,
                    bestWpm: 0,
                    avgAccuracy: 0,
                    bestAccuracy: 0,
                    totalTimePlayed: 0
                };
            } else {
                const totalGames = groupResults.length;
                const avgWpm = groupResults.reduce((sum, r) => sum + r.wpm, 0) / totalGames;
                const avgAccuracy = groupResults.reduce((sum, r) => sum + r.accuracy, 0) / totalGames;
                const bestWpm = Math.max(...groupResults.map(r => r.wpm));
                const bestAccuracy = Math.max(...groupResults.map(r => r.accuracy));
                const totalTimePlayed = groupResults.reduce((sum, r) => sum + r.timeTaken, 0);

                detailedStats[key] = {
                    totalGames,
                    avgWpm: Math.round(avgWpm * 100) / 100,
                    bestWpm,
                    avgAccuracy: Math.round(avgAccuracy * 100) / 100,
                    bestAccuracy,
                    totalTimePlayed
                };
            }
        }

        res.json(detailedStats);
    } catch (error) {
        console.error('Get detailed stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// DELETE /api/results/:id - Delete a specific result
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await req.prisma.result.findFirst({
            where: { id: parseInt(id), userId: req.user.id }
        });

        if (!result) {
            return res.status(404).json({ error: 'Result not found' });
        }

        await req.prisma.result.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Result deleted successfully' });
    } catch (error) {
        console.error('Delete result error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
