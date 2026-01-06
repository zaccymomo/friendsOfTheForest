const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { forestFriendAssets, generalAssets } = require('../config/s3Assets');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

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
            outlineUrl: forestFriendAssets[friend.name.toLowerCase()].outline,
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
        stickerBookBackground: generalAssets.stickerBookBackground,
        friends: result,
        summary: {
            completedFriends,
            totalFriends
        }
    });
});

module.exports = router; 