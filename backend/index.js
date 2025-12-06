const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const friendsRouter = require('./routes/friends');
app.use('/friends', friendsRouter);

const trailsRouter = require('./routes/trails');
app.use('/trails', trailsRouter);

const questionsRouter = require('./routes/questions');
app.use('/questions', questionsRouter);

const profileRouter = require('./routes/profile');
app.use('/profile', profileRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access from your phone using your computer's IP address on port ${PORT}`);
}); 