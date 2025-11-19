const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearDatabase() {
    console.log('Clearing database...');

    // Delete in order to respect foreign key constraints
    await prisma.option.deleteMany({});
    console.log('✓ Cleared options');

    await prisma.question.deleteMany({});
    console.log('✓ Cleared questions');

    await prisma.trailPhoto.deleteMany({});
    console.log('✓ Cleared trail photos');

    await prisma.trailBodyPart.deleteMany({});
    console.log('✓ Cleared trail body parts');

    await prisma.userBodyPart.deleteMany({});
    console.log('✓ Cleared user body parts');

    await prisma.userTrail.deleteMany({});
    console.log('✓ Cleared user trails');

    await prisma.forestFriendBodyPart.deleteMany({});
    console.log('✓ Cleared forest friend body parts');

    await prisma.trail.deleteMany({});
    console.log('✓ Cleared trails');

    await prisma.forestFriend.deleteMany({});
    console.log('✓ Cleared forest friends');

    await prisma.user.deleteMany({});
    console.log('✓ Cleared users');

    // Reset auto-increment sequences
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "User_id_seq" RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "ForestFriend_id_seq" RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "ForestFriendBodyPart_id_seq" RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "Trail_id_seq" RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "TrailPhoto_id_seq" RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "Question_id_seq" RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "Option_id_seq" RESTART WITH 1');
    console.log('✓ Reset auto-increment sequences');

    console.log('\n✅ Database cleared successfully!\n');
}

async function runSeed() {
    console.log('Running seed script...\n');
    // Import and run the seed script
    require('./seed.js');
}

async function main() {
    await clearDatabase();
    await runSeed();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
