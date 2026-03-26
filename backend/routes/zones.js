const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// POST /zones/:id/visit - record that the user has visited a zone
router.post('/:id/visit', requireAuth, async (req, res) => {
    const userId = req.user.userId;
    const zoneId = parseInt(req.params.id);

    const zone = await prisma.zone.findUnique({ where: { id: zoneId } });
    if (!zone) return res.status(404).json({ error: 'Zone not found' });

    await prisma.userZone.upsert({
        where: { userId_zoneId: { userId, zoneId } },
        update: {},
        create: { userId, zoneId },
    });

    res.json({ success: true });
});

module.exports = router;
