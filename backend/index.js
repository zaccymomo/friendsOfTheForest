const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Configure CORS for production (support both user and admin frontends)
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean);
const corsOptions = {
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    credentials: true
};
app.use(cors(corsOptions));
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

const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access from your phone using your computer's IP address on port ${PORT}`);
}); 