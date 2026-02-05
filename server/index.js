const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Create Express app first
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Setup Prisma with pg adapter
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Make prisma available in routes
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

// Health check - simple route first
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Morse Code API is running!' });
});

// Auth routes
const authRoutes = require('./routes/auth.js');
app.use('/api/auth', authRoutes);

// Results routes  
const resultsRoutes = require('./routes/results.js');
app.use('/api/results', resultsRoutes);

// Settings routes
const settingsRoutes = require('./routes/settings.js');
app.use('/api/settings', settingsRoutes);

// Random routes (for random letters and words)
const randomRoutes = require('./routes/random.js');
app.use('/api/random', randomRoutes);


// Start server synchronously
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Explicitly prevent server from closing
server.on('close', () => {
    console.log('Server closing...');
});

// Handle errors
server.on('error', (err) => {
    console.error('Server error:', err);
});

// Test database connection asynchronously after server starts
pool.query('SELECT NOW()').then(result => {
    console.log('✅ Database connected:', result.rows[0].now);
}).catch(err => {
    console.error('❌ Database connection error:', err.message);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down...');
    server.close();
    await prisma.$disconnect();
    await pool.end();
    process.exit(0);
});
