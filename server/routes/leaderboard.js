const express = require('express');
const router = express.Router();

// GET /api/leaderboard
// Returns the top players sorted by average WPM and Accuracy
router.get('/', async (req, res) => {
    try {
        const topPlayers = await req.prisma.user.findMany({
            where: {
                totalPlay: { gt: 0 } // Only include users who have actually played
            },
            select: {
                id: true,
                username: true,
                rank: true,
                avgWpm: true,
                avgAccuracy: true,
                totalPlay: true
            },
            orderBy: [
                { avgWpm: 'desc' },
                { avgAccuracy: 'desc' }
            ],
            take: 50 // Limit to top 50 players
        });

        res.json(topPlayers);
    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        res.status(500).json({ error: 'Internal server error while fetching leaderboard' });
    }
});

// GET /api/leaderboard/by-mode?mode=decode&symbol=a-z&amtWord=10
// Returns top players for a specific mode combination, ranked by best score (highWpm)
router.get('/by-mode', async (req, res) => {
    try {
        const { mode, symbol, amtWord } = req.query;

        if (!mode || !symbol || !amtWord) {
            return res.status(400).json({ error: 'mode, symbol, and amtWord are required' });
        }

        const modeRecord = await req.prisma.mode.findUnique({ where: { name: mode } });
        const symbolRecord = await req.prisma.symbol.findUnique({ where: { name: symbol } });
        const difficultyRecord = await req.prisma.difficulty.findFirst({ where: { amtWord: parseInt(amtWord) } });

        if (!modeRecord || !symbolRecord || !difficultyRecord) {
            return res.json([]);
        }

        const statuses = await req.prisma.userModeStatus.findMany({
            where: {
                modeId: modeRecord.id,
                symbolId: symbolRecord.id,
                difficultyId: difficultyRecord.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            },
            orderBy: [
                { highWpm: 'desc' },
                { highAccuracy: 'desc' }
            ],
            take: 50
        });

        const leaderboard = statuses.map((s, index) => ({
            id: s.user.id,
            username: s.user.username,
            rank: index + 1,
            highWpm: s.highWpm,
            highAccuracy: s.highAccuracy,
            updatedAt: s.updatedAt,
        }));

        res.json(leaderboard);
    } catch (error) {
        console.error('Leaderboard by-mode fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
