const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateQRCodeData() {
    try {
        // Get all questions with options
        const questions = await prisma.question.findMany({
            include: {
                trail: true,
                bodyPart: {
                    include: {
                        forestFriend: true
                    }
                },
                options: true
            }
        });

        console.log('\n=== QR CODES TO GENERATE ===\n');

        questions.forEach(question => {
            console.log(`Question ID: ${question.id}`);
            console.log(`Trail: ${question.trail.name}`);
            console.log(`For: ${question.bodyPart?.forestFriend?.name || 'Unknown'} - ${question.bodyPart?.name || 'Unknown'}`);
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

            console.log(`QR Code Content: ${question.id}`);
            console.log(`QR Code URL: https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${question.id}`);
            console.log('---\n');
        });

        console.log('INSTRUCTIONS:');
        console.log('1. Visit each QR Code URL above to generate the QR code');
        console.log('2. Save the QR code images');
        console.log('3. Print them and place them along your trail');
        console.log('4. Test by scanning with your app!');

    } catch (error) {
        console.error('Error generating QR code data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

generateQRCodeData();
