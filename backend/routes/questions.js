const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /questions/:id - fetch question by ID
router.get('/:id', requireAuth, async (req, res) => {
    const questionId = parseInt(req.params.id);
    const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: { options: true, bodyPart: true },
    });
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
});

// POST /questions/:id/answer - submit answer, validate, award body part if correct
router.post('/:id/answer', requireAuth, async (req, res) => {
    const userId = req.user.userId;
    const questionId = parseInt(req.params.id);
    const { answer } = req.body;
    const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: { options: true, bodyPart: true },
    });
    if (!question) return res.status(404).json({ error: 'Question not found' });
    let correct = false;
    if (question.type === 'MCQ') {
        // answer is option id
        const option = question.options.find(opt => opt.id === answer);
        if (option && option.correct) correct = true;
    } else if (question.type === 'OPEN') {
        // answer is string, check against correct option(s)
        const correctOption = question.options.find(opt => opt.correct);
        if (correctOption && correctOption.description.trim().toLowerCase() === answer.trim().toLowerCase()) correct = true;
    }
    // If correct and user doesn't already have the body part, award it
    let awarded = false;
    if (correct && question.bodyPart) {
        const existing = await prisma.userBodyPart.findUnique({
            where: { userId_bodyPartId: { userId, bodyPartId: question.bodyPart.id } },
        });
        if (!existing) {
            await prisma.userBodyPart.create({ data: { userId, bodyPartId: question.bodyPart.id } });
            awarded = true;
        }
    }
    res.json({ correct, awarded });
});

module.exports = router; 