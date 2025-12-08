const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...\n');

    // Create or update users
    const passwordHash = await bcrypt.hash('password', 10);
    const user = await prisma.user.upsert({
        where: { username: 'zacc' },
        update: {},
        create: {
            username: 'zacc',
            passwordHash: passwordHash,
        },
    });
    console.log('✓ Ensured user exists: zacc');

    const testPasswordHash = await bcrypt.hash('test', 10);
    await prisma.user.upsert({
        where: { username: 'test' },
        update: {},
        create: {
            username: 'test',
            passwordHash: testPasswordHash,
        },
    });
    console.log('✓ Ensured user exists: test\n');

    // Create forest friends (check if exist first)
    let hermitCrab = await prisma.forestFriend.findFirst({
        where: { name: 'Corey the Hermit Crab' }
    });
    if (!hermitCrab) {
        hermitCrab = await prisma.forestFriend.create({
            data: {
                name: 'Corey the Hermit Crab',
                imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/hermit.png'
            },
        });
        console.log('✓ Created forest friend: Corey the Hermit Crab');
    } else {
        console.log('✓ Forest friend already exists: Corey the Hermit Crab');
    }

    let koel = await prisma.forestFriend.findFirst({
        where: { name: 'Kingston the Koel' }
    });
    if (!koel) {
        koel = await prisma.forestFriend.create({
            data: {
                name: 'Kingston the Koel',
                imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/koel.png'
            },
        });
        console.log('✓ Created forest friend: Kingston the Koel');
    } else {
        console.log('✓ Forest friend already exists: Kingston the Koel');
    }

    let snail = await prisma.forestFriend.findFirst({
        where: { name: 'Sally the Snail' }
    });
    if (!snail) {
        snail = await prisma.forestFriend.create({
            data: {
                name: 'Sally the Snail',
                imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/snail.png'
            },
        });
        console.log('✓ Created forest friend: Sally the Snail\n');
    } else {
        console.log('✓ Forest friend already exists: Sally the Snail\n');
    }

    // Create body parts (check if exist first)
    let coreyClaw = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Corey's Claw" }
    });
    if (!coreyClaw) {
        coreyClaw = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Corey's Claw",
                rarity: 'COMMON',
                forestFriendId: hermitCrab.id,
            },
        });
    }

    let coreyShell = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Corey's Shell" }
    });
    if (!coreyShell) {
        coreyShell = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Corey's Shell",
                rarity: 'RARE',
                forestFriendId: hermitCrab.id,
            },
        });
    }

    let kingstonFeet = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Kingston's Feet" }
    });
    if (!kingstonFeet) {
        kingstonFeet = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Kingston's Feet",
                rarity: 'COMMON',
                imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/koel_feet.png',
                forestFriendId: koel.id,
            },
        });
    }

    let kingstonBody = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Kingston's Body" }
    });
    if (!kingstonBody) {
        kingstonBody = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Kingston's Body",
                rarity: 'COMMON',
                imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/koel_body.png',
                forestFriendId: koel.id,
            },
        });
    }

    let sallyShell = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Sally's Shell" }
    });
    if (!sallyShell) {
        sallyShell = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Sally's Shell",
                rarity: 'RARE',
                imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/snail_shell.png',
                forestFriendId: snail.id,
            },
        });
    }

    let sallyAntennae = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Sally's Antennae" }
    });
    if (!sallyAntennae) {
        sallyAntennae = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Sally's Antennae",
                rarity: 'LEGENDARY',
                imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/snail_antenna.png',
                forestFriendId: snail.id,
            },
        });
    }

    let sallyBody = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Sally's Body" }
    });
    if (!sallyBody) {
        sallyBody = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Sally's Body",
                rarity: 'COMMON',
                imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/snail_body.png',
                forestFriendId: snail.id,
            },
        });
    }
    console.log('✓ Ensured 7 body parts exist\n');

    // Create trails (check if exist first)
    let coastalTrail = await prisma.trail.findFirst({
        where: { name: 'Sentosa Coastal Trail' }
    });
    if (!coastalTrail) {
        coastalTrail = await prisma.trail.create({
            data: {
                name: 'Sentosa Coastal Trail',
                mapUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/photo_2025-11-20+00.57.10.jpeg',
                description: 'A scenic trail along the coast of Sentosa with beautiful ocean views.',
            },
        });
        console.log('✓ Created trail: Sentosa Coastal Trail');
    } else {
        console.log('✓ Trail already exists: Sentosa Coastal Trail');
    }

    let imbiahTrail = await prisma.trail.findFirst({
        where: { name: 'Sentosa Imbiah Trail' }
    });
    if (!imbiahTrail) {
        imbiahTrail = await prisma.trail.create({
            data: {
                name: 'Sentosa Imbiah Trail',
                mapUrl: 'https://www.sentosa.com.sg/-/media/sentosa/maps/imbiah-trail-map.jpg',
                description: 'A nature trail through the lush greenery of Imbiah area in Sentosa.',
            },
        });
        console.log('✓ Created trail: Sentosa Imbiah Trail\n');
    } else {
        console.log('✓ Trail already exists: Sentosa Imbiah Trail\n');
    }

    // Add trail photos (skip if already exist)
    const existingCoastalPhotos = await prisma.trailPhoto.count({
        where: { trailId: coastalTrail.id }
    });

    if (existingCoastalPhotos === 0) {
        await prisma.trailPhoto.createMany({
            data: [
                { trailId: coastalTrail.id, photoUrl: 'https://www.sentosa.com.sg/-/media/sentosa/article-listing/articles/2020/coastal-trail/coastal-trail-_hero.jpg?revision=b7a20f9f-4440-4b44-ac01-8a111205c522' },
                { trailId: coastalTrail.id, photoUrl: 'https://www.littledayout.com/wp-content/uploads/02-costalwalk.jpg' },
                { trailId: coastalTrail.id, photoUrl: 'https://www.littledayout.com/wp-content/uploads/a4coastal-walk.jpg' },
                { trailId: coastalTrail.id, photoUrl: 'https://thegeestravel.com/wp-content/uploads/2022/05/Coastal-Trail-View-Keppel-Bay-768x512.jpg' },
                { trailId: coastalTrail.id, photoUrl: 'https://thegeestravel.com/wp-content/uploads/2022/05/Coastal-Trail-View.jpg' },
            ],
        });
    }

    const existingImbiahPhotos = await prisma.trailPhoto.count({
        where: { trailId: imbiahTrail.id }
    });

    if (existingImbiahPhotos === 0) {
        await prisma.trailPhoto.createMany({
            data: [
                { trailId: imbiahTrail.id, photoUrl: 'https://www.sentosa.com.sg/-/media/sentosa/article-listing/articles/2020/guide-to-imbiah-trail/imbiah-entrance.jpg?revision=914ae4ff-c4da-46d3-ab64-3e76fcf6b649' },
                { trailId: imbiahTrail.id, photoUrl: 'https://www.littledayout.com/wp-content/uploads/08-mount-imbiah-trail.jpg' },
            ],
        });
    }
    console.log('✓ Ensured trail photos exist\n');

    // Link body parts to trails (skip if already linked)
    const existingTrailBodyParts = await prisma.trailBodyPart.count();
    if (existingTrailBodyParts === 0) {
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
    } else {
        console.log('✓ Body parts already linked to trails\n');
    }

    // Create questions (check if exist first)
    const existingQuestions = await prisma.question.count();
    if (existingQuestions === 0) {
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
    } else {
        console.log('✓ Questions already exist\n');
    }

    // Give user "zacc" some initial progress (skip if already exists)
    const existingUserBodyParts = await prisma.userBodyPart.count({
        where: { userId: user.id }
    });

    if (existingUserBodyParts === 0) {
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
    } else {
        console.log('✓ User "zacc" already has body parts\n');
    }

    // Add user trails (skip if already exists)
    const existingUserTrails = await prisma.userTrail.count({
        where: { userId: user.id }
    });

    if (existingUserTrails === 0) {
        await prisma.userTrail.createMany({
            data: [
                { userId: user.id, trailId: coastalTrail.id },
                { userId: user.id, trailId: imbiahTrail.id },
            ],
        });
        console.log('✓ Added trails for user "zacc"\n');
    } else {
        console.log('✓ User "zacc" already has trails\n');
    }

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
