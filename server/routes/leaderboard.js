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

module.exports = router;
