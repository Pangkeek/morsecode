const express = require('express');

const router = express.Router();

// GET /api/random/letters - Get random letters
router.get('/letters', async (req, res) => {
    try {
        const count = parseInt(req.query.count) || 10;
        const maxCount = 100;
        const actualCount = Math.min(count, maxCount);

        const letters = [];
        for (let i = 0; i < actualCount; i++) {
            letters.push(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
        }

        res.json({ letters });
    } catch (error) {
        console.error('Get random letters error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/random/words - Get random words from database
router.get('/words', async (req, res) => {
    try {
        const count = parseInt(req.query.count) || 10;
        const maxCount = 100;
        const actualCount = Math.min(count, maxCount);

        // Get total word count
        const totalWords = await req.prisma.word.count();

        if (totalWords === 0) {
            // Fallback to default words if database is empty
            const defaultWords = ['THE', 'QUICK', 'BROWN', 'FOX', 'JUMPS', 'OVER', 'LAZY', 'DOG', 'HELLO', 'WORLD', 'MORSE', 'CODE', 'SIGNAL', 'RADIO', 'HELP', 'SOS'];
            const words = [];
            for (let i = 0; i < actualCount; i++) {
                words.push(defaultWords[Math.floor(Math.random() * defaultWords.length)]);
            }
            return res.json({ words });
        }

        // Get random words from database
        const allWords = await req.prisma.word.findMany();
        const words = [];
        for (let i = 0; i < actualCount; i++) {
            const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
            words.push(randomWord.word);
        }

        res.json({ words });
    } catch (error) {
        console.error('Get random words error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/random/words/seed - Seed database with words (admin only, no auth for now)
router.post('/words/seed', async (req, res) => {
    try {
        const wordsToSeed = [
            // Easy words (3-4 letters)
            { word: 'THE', difficulty: 'easy' },
            { word: 'CAT', difficulty: 'easy' },
            { word: 'DOG', difficulty: 'easy' },
            { word: 'SUN', difficulty: 'easy' },
            { word: 'RUN', difficulty: 'easy' },
            { word: 'FUN', difficulty: 'easy' },
            { word: 'ONE', difficulty: 'easy' },
            { word: 'TWO', difficulty: 'easy' },
            { word: 'RED', difficulty: 'easy' },
            { word: 'BIG', difficulty: 'easy' },
            { word: 'SOS', difficulty: 'easy' },
            { word: 'YES', difficulty: 'easy' },
            { word: 'HI', difficulty: 'easy' },
            { word: 'GO', difficulty: 'easy' },
            { word: 'NO', difficulty: 'easy' },
            { word: 'OK', difficulty: 'easy' },
            { word: 'UP', difficulty: 'easy' },
            { word: 'BOX', difficulty: 'easy' },
            { word: 'FOX', difficulty: 'easy' },
            { word: 'CAN', difficulty: 'easy' },

            // Medium words (5-6 letters)
            { word: 'HELLO', difficulty: 'medium' },
            { word: 'WORLD', difficulty: 'medium' },
            { word: 'MORSE', difficulty: 'medium' },
            { word: 'RADIO', difficulty: 'medium' },
            { word: 'QUICK', difficulty: 'medium' },
            { word: 'BROWN', difficulty: 'medium' },
            { word: 'JUMPS', difficulty: 'medium' },
            { word: 'DELTA', difficulty: 'medium' },
            { word: 'ALPHA', difficulty: 'medium' },
            { word: 'BRAVO', difficulty: 'medium' },
            { word: 'OSCAR', difficulty: 'medium' },
            { word: 'HOTEL', difficulty: 'medium' },
            { word: 'INDIA', difficulty: 'medium' },
            { word: 'JULIET', difficulty: 'medium' },
            { word: 'KILO', difficulty: 'medium' },
            { word: 'LIMA', difficulty: 'medium' },
            { word: 'MIKE', difficulty: 'medium' },
            { word: 'SIGMA', difficulty: 'medium' },
            { word: 'TANGO', difficulty: 'medium' },
            { word: 'ZULU', difficulty: 'medium' },

            // Hard words (7+ letters)
            { word: 'CHARLIE', difficulty: 'hard' },
            { word: 'WHISKEY', difficulty: 'hard' },
            { word: 'NOVEMBER', difficulty: 'hard' },
            { word: 'UNIFORM', difficulty: 'hard' },
            { word: 'VICTOR', difficulty: 'hard' },
            { word: 'XRAY', difficulty: 'hard' },
            { word: 'YANKEE', difficulty: 'hard' },
            { word: 'FOXTROT', difficulty: 'hard' },
            { word: 'GOLF', difficulty: 'hard' },
            { word: 'PAPA', difficulty: 'hard' },
            { word: 'QUEBEC', difficulty: 'hard' },
            { word: 'ROMEO', difficulty: 'hard' },
            { word: 'SIERRA', difficulty: 'hard' },
            { word: 'SIGNAL', difficulty: 'hard' },
            { word: 'NETWORK', difficulty: 'hard' },
            { word: 'OPERATOR', difficulty: 'hard' },
            { word: 'MESSAGE', difficulty: 'hard' },
            { word: 'TRANSMIT', difficulty: 'hard' },
            { word: 'RECEIVE', difficulty: 'hard' },
            { word: 'DECODE', difficulty: 'hard' }
        ];

        // Upsert each word
        for (const wordData of wordsToSeed) {
            await req.prisma.word.upsert({
                where: { word: wordData.word },
                update: { difficulty: wordData.difficulty },
                create: wordData
            });
        }

        const totalWords = await req.prisma.word.count();
        res.json({ message: `Seeded ${wordsToSeed.length} words. Total words in database: ${totalWords}` });
    } catch (error) {
        console.error('Seed words error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/random/words/list - List all words in database
router.get('/words/list', async (req, res) => {
    try {
        const words = await req.prisma.word.findMany({
            orderBy: { difficulty: 'asc' }
        });
        res.json(words);
    } catch (error) {
        console.error('List words error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
