const { PrismaClient } = require('@prisma/client');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

// Set FRONTEND_URL env var before running, or it defaults to localhost
// On Railway: already set in environment. Locally: set in shell or use default
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

async function generateQRCodeData() {
    try {
        // Create directory for QR codes
        const qrCodesDir = path.join(__dirname, 'qr-codes');
        if (!fs.existsSync(qrCodesDir)) {
            fs.mkdirSync(qrCodesDir, { recursive: true });
        }

        // Get all questions with options and related body parts
        const questions = await prisma.question.findMany({
            include: {
                trail: true,
                bodyParts: {
                    include: {
                        bodyPart: {
                            include: {
                                forestFriend: true
                            }
                        }
                    }
                },
                options: true
            }
        });

        console.log('\n=== GENERATING QR CODES ===\n');

        let successCount = 0;
        const failedQuestions = [];

        for (const question of questions) {
            console.log(`Question ID: ${question.id}`);
            console.log(`Trail: ${question.trail.name}`);

            if (question.bodyParts && question.bodyParts.length > 0) {
                question.bodyParts.forEach(qbp => {
                    const bp = qbp.bodyPart;
                    console.log(`For: ${bp?.forestFriend?.name || 'Unknown'} - ${bp?.name || 'Unknown'}`);
                });
            } else {
                console.log('For: None');
            }

            console.log(`Question: ${question.question}`);
            console.log(`Type: ${question.type}`);

            // Display answers
            if (question.options && question.options.length > 0) {
                const correctAnswers = question.options.filter(opt => opt.correct);
                console.log(`Correct Answer(s):`);
                correctAnswers.forEach(answer => {
                    console.log(`  - ${answer.description}`);
                });

                if (question.type === 'MCQ') {
                    console.log(`All Options:`);
                    question.options.forEach((opt, idx) => {
                        console.log(`  ${idx + 1}. ${opt.description} ${opt.correct ? '✓' : ''}`);
                    });
                }
            }

            // Generate QR code filename
            const trailName = question.trail.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filename = `question_${question.id}_${trailName}.png`;
            const filepath = path.join(qrCodesDir, filename);

            const qrUrl = `${FRONTEND_URL}/question/${question.id}`;
            console.log(`URL: ${qrUrl}`);

            try {
                // Generate QR code and save to file
                await QRCode.toFile(filepath, qrUrl, {
                    width: 400,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });

                console.log(`✓ QR Code saved: ${filename}`);
                successCount++;
            } catch (err) {
                console.error(`✗ Failed to generate QR code: ${err.message}`);
                failedQuestions.push(question.id);
            }

            console.log('---\n');
        }

        console.log('\n=== SUMMARY ===');
        console.log(`Total Questions: ${questions.length}`);
        console.log(`Successfully Generated: ${successCount}`);
        console.log(`Failed: ${failedQuestions.length}`);
        if (failedQuestions.length > 0) {
            console.log(`Failed Question IDs: ${failedQuestions.join(', ')}`);
        }
        console.log(`\nQR codes saved to: ${qrCodesDir}`);
        console.log('\nINSTRUCTIONS:');
        console.log('1. Open the qr-codes directory');
        console.log('2. Print the QR code images');
        console.log('3. Place them along your trail at the appropriate locations');
        console.log('4. Test by scanning with your app!');

    } catch (error) {
        console.error('Error generating QR code data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

generateQRCodeData();
