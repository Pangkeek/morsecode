const express = require('express');
const { authenticateToken } = require('./auth.js');
const router = express.Router();

// Middleware to check if user is an ADMIN
const isAdmin = (req, res, next) => {
    // We assume authenticateToken has already run and populated req.user
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
};

// Apply auth and admin middleware to all routes in this file
router.use(authenticateToken);
router.use(isAdmin);

// GET /api/admin/metrics - Get global platform statistics
router.get('/metrics', async (req, res) => {
    try {
        const totalUsers = await req.prisma.user.count();
        const totalPlaySessions = await req.prisma.playSession.count();

        // Calculate global average WPM from Users table
        const usersWithStats = await req.prisma.user.findMany({
            where: { totalPlay: { gt: 0 } },
            select: { avgWpm: true }
        });

        const globalAvgWpm = usersWithStats.length > 0
            ? usersWithStats.reduce((sum, u) => sum + u.avgWpm, 0) / usersWithStats.length
            : 0;

        // Find platform's most failed characters
        // We'll query SessionDetails where isCorrect is false, similar to the global weakness route
        // but not restricted to a single user. We might limit this query to the last 10,000 details for performance.
        const allMistakes = await req.prisma.sessionDetail.findMany({
            where: { isCorrect: false },
            select: { question: true, correctAnswer: true },
            take: 10000,
            orderBy: { id: 'desc' }
        });

        const charCounts = {};
        allMistakes.forEach(m => {
            const char = m.correctAnswer || m.question;
            if (char) {
                charCounts[char] = (charCounts[char] || 0) + 1;
            }
        });

        const mostFailedCharacters = Object.entries(charCounts)
            .map(([character, errorCount]) => ({ character, errorCount }))
            .sort((a, b) => b.errorCount - a.errorCount)
            .slice(0, 10); // Top 10

        res.json({
            totalUsers,
            totalPlaySessions,
            globalAvgWpm: Math.round(globalAvgWpm * 10) / 10, // Round to 1 decimal
            mostFailedCharacters
        });

    } catch (error) {
        console.error('Admin metrics error:', error);
        res.status(500).json({ error: 'Internal server error while fetching admin metrics' });
    }
});

// GET /api/admin/contents - Get all game content with human-readable names
router.get('/contents', async (req, res) => {
    try {
        const contents = await req.prisma.content.findMany({
            include: {
                mode: true,
                difficulty: true,
                symbol: true
            },
            orderBy: [
                { modeId: 'asc' },
                { symbolId: 'asc' },
                { difficultyId: 'asc' }
            ]
        });

        res.json(contents);
    } catch (error) {
        console.error('Admin contents error:', error);
        res.status(500).json({ error: 'Internal server error while fetching content' });
    }
});

// PUT /api/admin/contents/:id - Update game content
router.put('/contents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const updated = await req.prisma.content.update({
            where: { id: parseInt(id) },
            data: { content }
        });

        res.json(updated);
    } catch (error) {
        console.error('Admin content update error:', error);
        res.status(500).json({ error: 'Internal server error while updating content' });
    }
});

module.exports = router;
