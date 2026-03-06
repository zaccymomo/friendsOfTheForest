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
            questions: {
                include: {
                    options: true,
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
                },
            },
        },
    });
    if (!trail) return res.status(404).json({ error: 'Trail not found' });
    // Collect all body parts from questions, deduplicated by id
    const bodyPartMap = new Map();
    for (const question of trail.questions) {
        for (const qbp of question.bodyParts) {
            const bp = qbp.bodyPart;
            if (!bodyPartMap.has(bp.id)) {
                bodyPartMap.set(bp.id, {
                    id: bp.id,
                    name: bp.name,
                    rarity: bp.rarity,
                    imageUrl: bp.imageUrl,
                    imageUrlZoomed: bp.imageUrlZoomed,
                    forestFriend: bp.forestFriend.name,
                    found: bp.userBodyParts.length > 0,
                });
            }
        }
    }
    const bodyParts = Array.from(bodyPartMap.values());
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