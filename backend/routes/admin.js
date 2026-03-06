const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { uploadToS3, deleteFromS3 } = require('../utils/s3Upload');

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Apply auth middleware to all routes
router.use(requireAuth);
router.use(requireAdmin);

// ============================================================================
// FOREST FRIENDS MANAGEMENT
// ============================================================================

// GET /admin/friends - List all forest friends with body parts count
router.get('/friends', async (req, res) => {
    try {
        const friends = await prisma.forestFriend.findMany({
            include: {
                bodyParts: true,
                _count: { select: { bodyParts: true } }
            },
            orderBy: { id: 'asc' }
        });
        res.json(friends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /admin/friends/:id - Get single forest friend with all body parts
router.get('/friends/:id', async (req, res) => {
    try {
        const friend = await prisma.forestFriend.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { bodyParts: true }
        });
        if (!friend) return res.status(404).json({ error: 'Friend not found' });
        res.json(friend);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /admin/friends - Create new forest friend
router.post('/friends', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype, '');
        }

        const friend = await prisma.forestFriend.create({
            data: { name, imageUrl }
        });
        res.json(friend);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /admin/friends/:id - Update forest friend
router.put('/friends/:id', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;
        const id = parseInt(req.params.id);

        const existing = await prisma.forestFriend.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Friend not found' });

        let imageUrl = existing.imageUrl;
        if (req.file) {
            // Delete old image if exists
            if (existing.imageUrl) {
                await deleteFromS3(existing.imageUrl);
            }
            imageUrl = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype, '');
        }

        const friend = await prisma.forestFriend.update({
            where: { id },
            data: { name, imageUrl }
        });
        res.json(friend);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /admin/friends/:id - Delete forest friend (cascades to body parts)
router.delete('/friends/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const friend = await prisma.forestFriend.findUnique({
            where: { id },
            include: { bodyParts: true }
        });
        if (!friend) return res.status(404).json({ error: 'Friend not found' });

        // Delete all images from S3
        if (friend.imageUrl) await deleteFromS3(friend.imageUrl);
        for (const part of friend.bodyParts) {
            if (part.imageUrl) await deleteFromS3(part.imageUrl);
            if (part.imageUrlZoomed) await deleteFromS3(part.imageUrlZoomed);
        }

        await prisma.forestFriend.delete({ where: { id } });
        res.json({ message: 'Forest friend deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// BODY PARTS MANAGEMENT
// ============================================================================

// GET /admin/bodyparts - List all body parts
router.get('/bodyparts', async (req, res) => {
    try {
        const parts = await prisma.forestFriendBodyPart.findMany({
            include: { forestFriend: true },
            orderBy: { id: 'asc' }
        });
        res.json(parts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /admin/bodyparts - Create body part with images
router.post('/bodyparts', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'imageZoomed', maxCount: 1 }
]), async (req, res) => {
    try {
        const { name, rarity, forestFriendId } = req.body;
        if (!name || !rarity || !forestFriendId) {
            return res.status(400).json({ error: 'Name, rarity, and forestFriendId are required' });
        }

        let imageUrl = null;
        let imageUrlZoomed = null;

        if (req.files?.image) {
            const file = req.files.image[0];
            imageUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype, '');
        }

        if (req.files?.imageZoomed) {
            const file = req.files.imageZoomed[0];
            imageUrlZoomed = await uploadToS3(file.buffer, file.originalname, file.mimetype, 'zoomed');
        }

        const bodyPart = await prisma.forestFriendBodyPart.create({
            data: {
                name,
                rarity,
                forestFriendId: parseInt(forestFriendId),
                imageUrl,
                imageUrlZoomed
            },
            include: { forestFriend: true }
        });
        res.json(bodyPart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /admin/bodyparts/:id - Update body part
router.put('/bodyparts/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'imageZoomed', maxCount: 1 }
]), async (req, res) => {
    try {
        const { name, rarity, forestFriendId } = req.body;
        const id = parseInt(req.params.id);

        const existing = await prisma.forestFriendBodyPart.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Body part not found' });

        let imageUrl = existing.imageUrl;
        let imageUrlZoomed = existing.imageUrlZoomed;

        if (req.files?.image) {
            if (existing.imageUrl) await deleteFromS3(existing.imageUrl);
            const file = req.files.image[0];
            imageUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype, '');
        }

        if (req.files?.imageZoomed) {
            if (existing.imageUrlZoomed) await deleteFromS3(existing.imageUrlZoomed);
            const file = req.files.imageZoomed[0];
            imageUrlZoomed = await uploadToS3(file.buffer, file.originalname, file.mimetype, 'zoomed');
        }

        const bodyPart = await prisma.forestFriendBodyPart.update({
            where: { id },
            data: {
                name,
                rarity,
                forestFriendId: parseInt(forestFriendId),
                imageUrl,
                imageUrlZoomed
            },
            include: { forestFriend: true }
        });
        res.json(bodyPart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /admin/bodyparts/:id - Delete body part
router.delete('/bodyparts/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const part = await prisma.forestFriendBodyPart.findUnique({ where: { id } });
        if (!part) return res.status(404).json({ error: 'Body part not found' });

        if (part.imageUrl) await deleteFromS3(part.imageUrl);
        if (part.imageUrlZoomed) await deleteFromS3(part.imageUrlZoomed);

        await prisma.forestFriendBodyPart.delete({ where: { id } });
        res.json({ message: 'Body part deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// TRAILS MANAGEMENT
// ============================================================================

// GET /admin/trails - List all trails
router.get('/trails', async (req, res) => {
    try {
        const trails = await prisma.trail.findMany({
            include: {
                photos: true,
                _count: { select: { questions: true } }
            },
            orderBy: { id: 'asc' }
        });
        res.json(trails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /admin/trails/:id - Get trail with all details
router.get('/trails/:id', async (req, res) => {
    try {
        const trail = await prisma.trail.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                photos: true,
                questions: {
                    include: { options: true, bodyParts: { include: { bodyPart: { include: { forestFriend: true } } } } }
                }
            }
        });
        if (!trail) return res.status(404).json({ error: 'Trail not found' });
        res.json(trail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /admin/trails - Create trail
router.post('/trails', upload.single('mapImage'), async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }

        let mapUrl = null;
        if (req.file) {
            mapUrl = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype, 'trails');
        }

        const trail = await prisma.trail.create({
            data: { name, description, mapUrl }
        });
        res.json(trail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /admin/trails/:id - Update trail
router.put('/trails/:id', upload.single('mapImage'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const id = parseInt(req.params.id);

        const existing = await prisma.trail.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Trail not found' });

        let mapUrl = existing.mapUrl;
        if (req.file) {
            if (existing.mapUrl) await deleteFromS3(existing.mapUrl);
            mapUrl = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype, 'trails');
        }

        const trail = await prisma.trail.update({
            where: { id },
            data: { name, description, mapUrl }
        });
        res.json(trail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /admin/trails/:id - Delete trail
router.delete('/trails/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const trail = await prisma.trail.findUnique({
            where: { id },
            include: { photos: true }
        });
        if (!trail) return res.status(404).json({ error: 'Trail not found' });

        if (trail.mapUrl) await deleteFromS3(trail.mapUrl);
        for (const photo of trail.photos) {
            await deleteFromS3(photo.photoUrl);
        }

        await prisma.trail.delete({ where: { id } });
        res.json({ message: 'Trail deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /admin/trails/:id/photos - Add trail photo
router.post('/trails/:id/photos', upload.single('photo'), async (req, res) => {
    try {
        const trailId = parseInt(req.params.id);
        if (!req.file) return res.status(400).json({ error: 'Photo is required' });

        const photoUrl = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype, 'trails');
        const photo = await prisma.trailPhoto.create({
            data: { trailId, photoUrl }
        });
        res.json(photo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /admin/trails/:trailId/photos/:photoId - Delete trail photo
router.delete('/trails/:trailId/photos/:photoId', async (req, res) => {
    try {
        const photoId = parseInt(req.params.photoId);
        const photo = await prisma.trailPhoto.findUnique({ where: { id: photoId } });
        if (!photo) return res.status(404).json({ error: 'Photo not found' });

        await deleteFromS3(photo.photoUrl);
        await prisma.trailPhoto.delete({ where: { id: photoId } });
        res.json({ message: 'Photo deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ============================================================================
// QUESTIONS MANAGEMENT
// ============================================================================

// GET /admin/questions - List all questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await prisma.question.findMany({
            include: {
                trail: true,
                bodyParts: { include: { bodyPart: { include: { forestFriend: true } } } },
                options: true
            },
            orderBy: { id: 'asc' }
        });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /admin/questions/:id - Get single question
router.get('/questions/:id', async (req, res) => {
    try {
        const question = await prisma.question.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                trail: true,
                bodyParts: { include: { bodyPart: { include: { forestFriend: true } } } },
                options: true
            }
        });
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json(question);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /admin/questions - Create question with options
router.post('/questions', async (req, res) => {
    try {
        const { trailId, bodyPartIds, question, type, options } = req.body;
        if (!trailId || !question || !type || !options) {
            return res.status(400).json({ error: 'trailId, question, type, and options are required' });
        }

        const newQuestion = await prisma.question.create({
            data: {
                trailId: parseInt(trailId),
                question,
                type,
                options: {
                    create: options.map(opt => ({
                        description: opt.description,
                        correct: opt.correct
                    }))
                },
                bodyParts: {
                    create: (bodyPartIds || []).map(id => ({ bodyPartId: parseInt(id) }))
                }
            },
            include: { options: true, bodyParts: { include: { bodyPart: { include: { forestFriend: true } } } }, trail: true }
        });
        res.json(newQuestion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /admin/questions/:id - Update question
router.put('/questions/:id', async (req, res) => {
    try {
        const { trailId, bodyPartIds, question, type, options } = req.body;
        const id = parseInt(req.params.id);

        const existing = await prisma.question.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Question not found' });

        // Delete existing options and body part links, then recreate
        await prisma.option.deleteMany({ where: { questionId: id } });
        await prisma.questionBodyPart.deleteMany({ where: { questionId: id } });

        const updated = await prisma.question.update({
            where: { id },
            data: {
                trailId: parseInt(trailId),
                question,
                type,
                options: {
                    create: options.map(opt => ({
                        description: opt.description,
                        correct: opt.correct
                    }))
                },
                bodyParts: {
                    create: (bodyPartIds || []).map(id => ({ bodyPartId: parseInt(id) }))
                }
            },
            include: { options: true, bodyParts: { include: { bodyPart: { include: { forestFriend: true } } } }, trail: true }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /admin/questions/:id - Delete question
router.delete('/questions/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const question = await prisma.question.findUnique({ where: { id } });
        if (!question) return res.status(404).json({ error: 'Question not found' });

        await prisma.question.delete({ where: { id } });
        res.json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// USER MANAGEMENT
// ============================================================================

// GET /admin/users - List all users
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                _count: { select: { bodyParts: true, trails: true } }
            },
            orderBy: { id: 'asc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /admin/users/:id - Get user details
router.get('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                bodyParts: {
                    include: {
                        bodyPart: {
                            include: { forestFriend: true }
                        }
                    }
                },
                trails: {
                    include: { trail: true }
                }
            }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /admin/users/:id/role - Promote/demote user
router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        const id = parseInt(req.params.id);

        if (!role || !['USER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ error: 'Valid role (USER or ADMIN) is required' });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, username: true, role: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /admin/users/:id - Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Prevent deleting self
        if (id === req.user.userId) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
