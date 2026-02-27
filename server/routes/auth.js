const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Validate input
        if (!email || !username || !password) {
            return res.status(400).json({ error: 'Email, username, and password are required' });
        }

        // Check if user already exists
        const existingUser = await req.prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with default settings
        const user = await req.prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                settings: {
                    create: {} // Creates with default values
                }
            },
            include: {
                settings: true
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                totalPlay: user.totalPlay,
                rank: user.rank,
                avgWpm: user.avgWpm,
                avgAccuracy: user.avgAccuracy,
                role: user.role,
                settings: user.settings
            },
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by username or email (reusing the 'username' variable from req.body)
        const user = await req.prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email: username } // User might have entered their email
                ]
            },
            include: { settings: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                totalPlay: user.totalPlay,
                rank: user.rank,
                avgWpm: user.avgWpm,
                avgAccuracy: user.avgAccuracy,
                role: user.role,
                settings: user.settings
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await req.prisma.user.findUnique({
            where: { id: req.user.id },
            include: { settings: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            email: user.email,
            username: user.username,
            totalPlay: user.totalPlay,
            rank: user.rank,
            avgWpm: user.avgWpm,
            avgAccuracy: user.avgAccuracy,
            role: user.role,
            settings: user.settings,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
