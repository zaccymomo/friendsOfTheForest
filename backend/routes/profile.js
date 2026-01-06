const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

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