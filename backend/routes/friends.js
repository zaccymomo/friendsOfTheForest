const express = require('express');
const jwt = require('jsonwebtoken');
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

// GET /friends - all forest friends and user's progress
router.get('/', requireAuth, async (req, res) => {
    const userId = req.user.userId;
    const friends = await prisma.forestFriend.findMany({
        include: {
            bodyParts: {
                include: {
                    userBodyParts: { where: { userId } },
                },
            },
        },
    });
    // Format: for each friend, list body parts and whether user has found them
    const result = friends.map(friend => {
        const totalParts = friend.bodyParts.length;
        const foundParts = friend.bodyParts.filter(bp => bp.userBodyParts.length > 0).length;
        const isCompleted = totalParts > 0 && foundParts === totalParts;
        return {
            id: friend.id,
            name: friend.name,
            imageUrl: friend.imageUrl,
            totalParts,
            foundParts,
            isCompleted,
            bodyParts: friend.bodyParts.map(bp => ({
                id: bp.id,
                name: bp.name,
                rarity: bp.rarity,
                imageUrl: bp.imageUrl,
                found: bp.userBodyParts.length > 0,
            })),
        };
    });

    // Add summary statistics
    const completedFriends = result.filter(f => f.isCompleted).length;
    const totalFriends = result.length;

    res.json({
        friends: result,
        summary: {
            completedFriends,
            totalFriends
        }
    });
});

module.exports = router; 