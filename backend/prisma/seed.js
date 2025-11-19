const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...\n');

    // Create users
    const passwordHash = await bcrypt.hash('password', 10);
    const user = await prisma.user.create({
        data: {
            username: 'zacc',
            passwordHash: passwordHash,
        },
    });
    console.log('✓ Created user: zacc');

    const testPasswordHash = await bcrypt.hash('test', 10);
    await prisma.user.create({
        data: {
            username: 'test',
            passwordHash: testPasswordHash,
        },
    });
    console.log('✓ Created user: test\n');

    // Create forest friends
    const hermitCrab = await prisma.forestFriend.create({
        data: {
            name: 'Corey the Hermit Crab',
            imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/hermit.png'
        },
    });
    console.log('✓ Created forest friend: Corey the Hermit Crab');

    const koel = await prisma.forestFriend.create({
        data: {
            name: 'Kingston the Koel',
            imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/koel.png'
        },
    });
    console.log('✓ Created forest friend: Kingston the Koel');

    const snail = await prisma.forestFriend.create({
        data: {
            name: 'Sally the Snail',
            imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/snail.png'
        },
    });
    console.log('✓ Created forest friend: Sally the Snail\n');

    // Create body parts
    const coreyClaw = await prisma.forestFriendBodyPart.create({
        data: {
            name: "Corey's Claw",
            rarity: 'COMMON',
            forestFriendId: hermitCrab.id,
        },
    });

    const coreyShell = await prisma.forestFriendBodyPart.create({
        data: {
            name: "Corey's Shell",
            rarity: 'RARE',
            forestFriendId: hermitCrab.id,
        },
    });

    const kingstonFeet = await prisma.forestFriendBodyPart.create({
        data: {
            name: "Kingston's Feet",
            rarity: 'COMMON',
            imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/koel_feet.png',
            forestFriendId: koel.id,
        },
    });

    const kingstonBody = await prisma.forestFriendBodyPart.create({
        data: {
            name: "Kingston's Body",
            rarity: 'COMMON',
            imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/koel_body.png',
            forestFriendId: koel.id,
        },
    });

    const sallyShell = await prisma.forestFriendBodyPart.create({
        data: {
            name: "Sally's Shell",
            rarity: 'RARE',
            imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/snail_shell.png',
            forestFriendId: snail.id,
        },
    });

    const sallyAntennae = await prisma.forestFriendBodyPart.create({
        data: {
            name: "Sally's Antennae",
            rarity: 'LEGENDARY',
            imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/snail_antenna.png',
            forestFriendId: snail.id,
        },
    });

    const sallyBody = await prisma.forestFriendBodyPart.create({
        data: {
            name: "Sally's Body",
            rarity: 'COMMON',
            imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/snail_body.png',
            forestFriendId: snail.id,
        },
    });
    console.log('✓ Created 7 body parts\n');

    // Create trails
    const coastalTrail = await prisma.trail.create({
        data: {
            name: 'Sentosa Coastal Trail',
            mapUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/photo_2025-11-20+00.57.10.jpeg',
            description: 'A scenic trail along the coast of Sentosa with beautiful ocean views.',
        },
    });
    console.log('✓ Created trail: Sentosa Coastal Trail');

    const imbiahTrail = await prisma.trail.create({
        data: {
            name: 'Sentosa Imbiah Trail',
            mapUrl: 'https://www.sentosa.com.sg/-/media/sentosa/maps/imbiah-trail-map.jpg',
            description: 'A nature trail through the lush greenery of Imbiah area in Sentosa.',
        },
    });
    console.log('✓ Created trail: Sentosa Imbiah Trail\n');

    // Add trail photos
    await prisma.trailPhoto.createMany({
        data: [
            { trailId: coastalTrail.id, photoUrl: 'https://www.sentosa.com.sg/-/media/sentosa/article-listing/articles/2020/coastal-trail/coastal-trail-_hero.jpg?revision=b7a20f9f-4440-4b44-ac01-8a111205c522' },
            { trailId: coastalTrail.id, photoUrl: 'https://www.littledayout.com/wp-content/uploads/02-costalwalk.jpg' },
            { trailId: coastalTrail.id, photoUrl: 'https://www.littledayout.com/wp-content/uploads/a4coastal-walk.jpg' },
            { trailId: coastalTrail.id, photoUrl: 'https://thegeestravel.com/wp-content/uploads/2022/05/Coastal-Trail-View-Keppel-Bay-768x512.jpg' },
            { trailId: coastalTrail.id, photoUrl: 'https://thegeestravel.com/wp-content/uploads/2022/05/Coastal-Trail-View.jpg' },
            { trailId: imbiahTrail.id, photoUrl: 'https://www.sentosa.com.sg/-/media/sentosa/article-listing/articles/2020/guide-to-imbiah-trail/imbiah-entrance.jpg?revision=914ae4ff-c4da-46d3-ab64-3e76fcf6b649' },
            { trailId: imbiahTrail.id, photoUrl: 'https://www.littledayout.com/wp-content/uploads/08-mount-imbiah-trail.jpg' },
        ],
    });
    console.log('✓ Created 4 trail photos\n');

    // Link body parts to trails
    await prisma.trailBodyPart.createMany({
        data: [
            // Sentosa Coastal Trail: Kingston (2 parts) + Sally (2 parts)
            { trailId: coastalTrail.id, bodyPartId: kingstonFeet.id },
            { trailId: coastalTrail.id, bodyPartId: kingstonBody.id },
            { trailId: coastalTrail.id, bodyPartId: sallyShell.id },
            { trailId: coastalTrail.id, bodyPartId: sallyBody.id },
            // Sentosa Imbiah Trail: Sally (1 remaining part) + Corey (1 part)
            { trailId: imbiahTrail.id, bodyPartId: sallyAntennae.id },
            { trailId: imbiahTrail.id, bodyPartId: coreyClaw.id },
        ],
    });
    console.log('✓ Linked body parts to trails\n');

    // Create questions
    // Q1: What is the name for a city that beats the heat?
    await prisma.question.create({
        data: {
            trailId: coastalTrail.id,
            bodyPartId: kingstonFeet.id,
            question: 'What is the name for a city that beats the heat?',
            type: 'OPEN',
            options: {
                create: [
                    { description: 'City in Nature', correct: true },
                ],
            },
        },
    });

    // Q2: Which of the following is false?
    await prisma.question.create({
        data: {
            trailId: coastalTrail.id,
            bodyPartId: kingstonBody.id,
            question: 'Which of the following is false?',
            type: 'MCQ',
            options: {
                create: [
                    { description: 'There are 9 animals shown on the poster', correct: false },
                    { description: 'We should only focus on taking care of a few important and cool animals', correct: true },
                    { description: 'Another name for the Long Tailed Macaques is Crab-Eating Macaque', correct: false },
                    { description: 'The thick-billed green pigeon is an endangered species', correct: false },
                ],
            },
        },
    });

    // Q3: Bonus Activity: How many steps did you take to get here, from the base of the stairs?
    await prisma.question.create({
        data: {
            trailId: coastalTrail.id,
            bodyPartId: sallyShell.id,
            question: 'Bonus Activity: How many steps did you take to get here, from the base of the stairs?',
            type: 'OPEN',
            options: {
                create: [
                    { description: '15', correct: true },
                ],
            },
        },
    });

    // Q4: What kind of harsh conditions do coastal forests face?
    await prisma.question.create({
        data: {
            trailId: coastalTrail.id,
            bodyPartId: sallyBody.id,
            question: 'What kind of harsh conditions do coastal forests face?',
            type: 'MCQ',
            options: {
                create: [
                    { description: 'Salt-laden winds', correct: false },
                    { description: 'Difficult terrains', correct: false },
                    { description: 'Poor soil', correct: false },
                    { description: 'All of the above', correct: true },
                ],
            },
        },
    });

    await prisma.question.create({
        data: {
            trailId: imbiahTrail.id,
            bodyPartId: sallyAntennae.id,
            question: 'What body part does Sally use to sense her environment?',
            type: 'OPEN',
            options: {
                create: [
                    { description: 'Antennae', correct: true },
                    { description: 'Tentacles', correct: true },
                ],
            },
        },
    });

    await prisma.question.create({
        data: {
            trailId: imbiahTrail.id,
            bodyPartId: coreyClaw.id,
            question: 'What color is Corey the Hermit Crab?',
            type: 'MCQ',
            options: {
                create: [
                    { description: 'Red', correct: true },
                    { description: 'Blue', correct: false },
                    { description: 'Green', correct: false },
                ],
            },
        },
    });
    console.log('✓ Created 6 questions with options\n');

    // Give user "zacc" some initial progress
    await prisma.userBodyPart.createMany({
        data: [
            // Give user all of Corey's parts (make Corey completed)
            { userId: user.id, bodyPartId: coreyClaw.id },
            { userId: user.id, bodyPartId: coreyShell.id },
            // Give user all of Kingston's parts (make Kingston completed)
            { userId: user.id, bodyPartId: kingstonFeet.id },
            { userId: user.id, bodyPartId: kingstonBody.id },
        ],
    });
    console.log('✓ Added body parts for user "zacc"\n');

    // Add user trails
    await prisma.userTrail.createMany({
        data: [
            { userId: user.id, trailId: coastalTrail.id },
            { userId: user.id, trailId: imbiahTrail.id },
        ],
    });
    console.log('✓ Added trails for user "zacc"\n');

    console.log('✅ Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
