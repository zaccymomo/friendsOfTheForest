const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// Auth middleware
function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// GET /profile - get current user info
router.get('/', requireAuth, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { id: true, username: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// POST /profile - update username and/or password
router.post('/', requireAuth, async (req, res) => {
    const { username, password } = req.body;
    const data = {};
    if (username) data.username = username;
    if (password) data.passwordHash = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.update({
            where: { id: req.user.userId },
            data,
            select: { id: true, username: true },
        });
        res.json(user);
    } catch (e) {
        if (e.code === 'P2002') {
            return res.status(409).json({ error: 'Username taken' });
        }
        throw e;
    }
});

module.exports = router; 