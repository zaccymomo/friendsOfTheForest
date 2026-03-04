const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /trails - all trails with photos
router.get('/', requireAuth, async (req, res) => {
    const trails = await prisma.trail.findMany({
        include: { photos: true },
    });
    res.json(trails);
});

// GET /trails/:id - trail detail with map, description, photos, body parts (with found status), questions
router.get('/:id', requireAuth, async (req, res) => {
    const userId = req.user.userId;
    const trailId = parseInt(req.params.id);
    const trail = await prisma.trail.findUnique({
        where: { id: trailId },
        include: {
            photos: true,
            bodyParts: {
                include: {
                    bodyPart: {
                        include: {
                            userBodyParts: { where: { userId } },
                            forestFriend: true,
                        },
                    },
                },
            },
            questions: {
                include: {
                    options: true,
                    bodyParts: { include: { bodyPart: true } },
                },
            },
        },
    });
    if (!trail) return res.status(404).json({ error: 'Trail not found' });
    // Format body parts with found status
    const bodyParts = trail.bodyParts.map(tb => ({
        id: tb.bodyPart.id,
        name: tb.bodyPart.name,
        rarity: tb.bodyPart.rarity,
        imageUrl: tb.bodyPart.imageUrl,
        imageUrlZoomed: tb.bodyPart.imageUrlZoomed,
        forestFriend: tb.bodyPart.forestFriend.name,
        found: tb.bodyPart.userBodyParts.length > 0,
    }));
    res.json({
        id: trail.id,
        name: trail.name,
        mapUrl: trail.mapUrl,
        description: trail.description,
        photos: trail.photos,
        bodyParts,
        questions: trail.questions,
    });
});

module.exports = router; 