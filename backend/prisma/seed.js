const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { forestFriendAssets, trailAssets } = require('../config/s3Assets');
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
    console.log('✓ Ensured user exists: test');

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin', 10);
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
        },
    });
    console.log('✓ Ensured admin user exists (username: admin, password: admin)\n');

    // Create forest friends (check if exist first)
    let spider = await prisma.forestFriend.findFirst({
        where: { name: 'Spider' }
    });
    if (!spider) {
        spider = await prisma.forestFriend.create({
            data: {
                name: 'Spider',
                imageUrl: forestFriendAssets.spider.outline
            },
        });
        console.log('✓ Created forest friend: Spider');
    } else {
        console.log('✓ Forest friend already exists: Spider');
    }

    let otter = await prisma.forestFriend.findFirst({
        where: { name: 'Otter' }
    });
    if (!otter) {
        otter = await prisma.forestFriend.create({
            data: {
                name: 'Otter',
                imageUrl: forestFriendAssets.otter.outline
            },
        });
        console.log('✓ Created forest friend: Otter');
    } else {
        console.log('✓ Forest friend already exists: Otter');
    }

    let lizard = await prisma.forestFriend.findFirst({
        where: { name: 'Lizard' }
    });
    if (!lizard) {
        lizard = await prisma.forestFriend.create({
            data: {
                name: 'Lizard',
                imageUrl: forestFriendAssets.lizard.outline
            },
        });
        console.log('✓ Created forest friend: Lizard');
    } else {
        console.log('✓ Forest friend already exists: Lizard');
    }

    let lion = await prisma.forestFriend.findFirst({
        where: { name: 'Lion' }
    });
    if (!lion) {
        lion = await prisma.forestFriend.create({
            data: {
                name: 'Lion',
                imageUrl: forestFriendAssets.lion.outline
            },
        });
        console.log('✓ Created forest friend: Lion');
    } else {
        console.log('✓ Forest friend already exists: Lion');
    }

    let koel = await prisma.forestFriend.findFirst({
        where: { name: 'Koel' }
    });
    if (!koel) {
        koel = await prisma.forestFriend.create({
            data: {
                name: 'Koel',
                imageUrl: forestFriendAssets.koel.outline
            },
        });
        console.log('✓ Created forest friend: Koel');
    } else {
        console.log('✓ Forest friend already exists: Koel');
    }

    let beetle = await prisma.forestFriend.findFirst({
        where: { name: 'Beetle' }
    });
    if (!beetle) {
        beetle = await prisma.forestFriend.create({
            data: {
                name: 'Beetle',
                imageUrl: forestFriendAssets.beetle.outline
            },
        });
        console.log('✓ Created forest friend: Beetle\n');
    } else {
        console.log('✓ Forest friend already exists: Beetle\n');
    }

    // Create body parts (check if exist first)
    // Spider body parts
    let spiderLegs = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Spider Legs" }
    });
    if (!spiderLegs) {
        spiderLegs = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Spider Legs",
                rarity: 'COMMON',
                imageUrl: forestFriendAssets.spider.legs,
                imageUrlZoomed: forestFriendAssets.spider.legsZoomed,
                forestFriendId: spider.id,
            },
        });
    }

    let spiderHead = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Spider Head" }
    });
    if (!spiderHead) {
        spiderHead = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Spider Head",
                rarity: 'RARE',
                imageUrl: forestFriendAssets.spider.head,
                imageUrlZoomed: forestFriendAssets.spider.headZoomed,
                forestFriendId: spider.id,
            },
        });
    }

    let spiderBody = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Spider Body" }
    });
    if (!spiderBody) {
        spiderBody = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Spider Body",
                rarity: 'COMMON',
                imageUrl: forestFriendAssets.spider.body,
                imageUrlZoomed: forestFriendAssets.spider.bodyZoomed,
                forestFriendId: spider.id,
            },
        });
    }

    // Otter body parts
    let otterTail = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Otter Tail" }
    });
    if (!otterTail) {
        otterTail = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Otter Tail",
                rarity: 'COMMON',
                imageUrl: forestFriendAssets.otter.tail,
                imageUrlZoomed: forestFriendAssets.otter.tailZoomed,
                forestFriendId: otter.id,
            },
        });
    }

    let otterHead = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Otter Head" }
    });
    if (!otterHead) {
        otterHead = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Otter Head",
                rarity: 'RARE',
                imageUrl: forestFriendAssets.otter.head,
                imageUrlZoomed: forestFriendAssets.otter.headZoomed,
                forestFriendId: otter.id,
            },
        });
    }

    let otterBody = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Otter Body" }
    });
    if (!otterBody) {
        otterBody = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Otter Body",
                rarity: 'COMMON',
                imageUrl: forestFriendAssets.otter.body,
                imageUrlZoomed: forestFriendAssets.otter.bodyZoomed,
                forestFriendId: otter.id,
            },
        });
    }

    // Lizard body parts
    let lizardTail = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Lizard Tail" }
    });
    if (!lizardTail) {
        lizardTail = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Lizard Tail",
                rarity: 'COMMON',
                imageUrl: forestFriendAssets.lizard.tail,
                imageUrlZoomed: forestFriendAssets.lizard.tailZoomed,
                forestFriendId: lizard.id,
            },
        });
    }

    let lizardHead = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Lizard Head" }
    });
    if (!lizardHead) {
        lizardHead = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Lizard Head",
                rarity: 'RARE',
                imageUrl: forestFriendAssets.lizard.head,
                imageUrlZoomed: forestFriendAssets.lizard.headZoomed,
                forestFriendId: lizard.id,
            },
        });
    }

    let lizardBody = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Lizard Body" }
    });
    if (!lizardBody) {
        lizardBody = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Lizard Body",
                rarity: 'COMMON',
                imageUrl: forestFriendAssets.lizard.body,
                imageUrlZoomed: forestFriendAssets.lizard.bodyZoomed,
                forestFriendId: lizard.id,
            },
        });
    }

    // Lion body parts
    let lionTail = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Lion Tail" }
    });
    if (!lionTail) {
        lionTail = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Lion Tail",
                rarity: 'COMMON',
                imageUrl: forestFriendAssets.lion.tail,
                imageUrlZoomed: forestFriendAssets.lion.tailZoomed,
                forestFriendId: lion.id,
            },
        });
    }

    let lionHead = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Lion Head" }
    });
    if (!lionHead) {
        lionHead = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Lion Head",
                rarity: 'LEGENDARY',
                imageUrl: forestFriendAssets.lion.head,
                imageUrlZoomed: forestFriendAssets.lion.headZoomed,
                forestFriendId: lion.id,
            },
        });
    }

    let lionBody = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Lion Body" }
    });
    if (!lionBody) {
        lionBody = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Lion Body",
                rarity: 'RARE',
                imageUrl: forestFriendAssets.lion.body,
                imageUrlZoomed: forestFriendAssets.lion.bodyZoomed,
                forestFriendId: lion.id,
            },
        });
    }

    // Koel body parts
    let koelTail = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Koel Tail" }
    });
    if (!koelTail) {
        koelTail = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Koel Tail",
                rarity: 'COMMON',
                imageUrl: forestFriendAssets.koel.tail,
                imageUrlZoomed: forestFriendAssets.koel.tailZoomed,
                forestFriendId: koel.id,
            },
        });
    }

    let koelHeadBody = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Koel Head & Body" }
    });
    if (!koelHeadBody) {
        koelHeadBody = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Koel Head & Body",
                rarity: 'RARE',
                imageUrl: forestFriendAssets.koel.headBody,
                imageUrlZoomed: forestFriendAssets.koel.headBodyZoomed,
                forestFriendId: koel.id,
            },
        });
    }

    let koelClaws = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Koel Claws" }
    });
    if (!koelClaws) {
        koelClaws = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Koel Claws",
                rarity: 'COMMON',
                imageUrl: forestFriendAssets.koel.claws,
                imageUrlZoomed: forestFriendAssets.koel.clawsZoomed,
                forestFriendId: koel.id,
            },
        });
    }

    // Beetle body parts
    let beetleHead = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Beetle Head" }
    });
    if (!beetleHead) {
        beetleHead = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Beetle Head",
                rarity: 'COMMON',
                imageUrl: forestFriendAssets.beetle.head,
                imageUrlZoomed: forestFriendAssets.beetle.headZoomed,
                forestFriendId: beetle.id,
            },
        });
    }

    let beetleBody = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Beetle Body" }
    });
    if (!beetleBody) {
        beetleBody = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Beetle Body",
                rarity: 'RARE',
                imageUrl: forestFriendAssets.beetle.body,
                imageUrlZoomed: forestFriendAssets.beetle.bodyZoomed,
                forestFriendId: beetle.id,
            },
        });
    }

    let beetleAntenna = await prisma.forestFriendBodyPart.findFirst({
        where: { name: "Beetle Antenna" }
    });
    if (!beetleAntenna) {
        beetleAntenna = await prisma.forestFriendBodyPart.create({
            data: {
                name: "Beetle Antenna",
                rarity: 'LEGENDARY',
                imageUrl: forestFriendAssets.beetle.antenna,
                imageUrlZoomed: forestFriendAssets.beetle.antennaZoomed,
                forestFriendId: beetle.id,
            },
        });
    }
    console.log('✓ Ensured 18 body parts exist\n');

    // Create trails (check if exist first)
    let coastalTrail = await prisma.trail.findFirst({
        where: { name: 'Sentosa Coastal Trail' }
    });
    if (!coastalTrail) {
        coastalTrail = await prisma.trail.create({
            data: {
                name: 'Sentosa Coastal Trail',
                mapUrl: trailAssets.coastalTrailMap,
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
                // Sentosa Coastal Trail: Spider (3 parts) + Otter (3 parts) + Lizard (3 parts)
                { trailId: coastalTrail.id, bodyPartId: spiderLegs.id },
                { trailId: coastalTrail.id, bodyPartId: spiderHead.id },
                { trailId: coastalTrail.id, bodyPartId: spiderBody.id },
                { trailId: coastalTrail.id, bodyPartId: otterTail.id },
                { trailId: coastalTrail.id, bodyPartId: otterHead.id },
                { trailId: coastalTrail.id, bodyPartId: otterBody.id },
                { trailId: coastalTrail.id, bodyPartId: lizardTail.id },
                { trailId: coastalTrail.id, bodyPartId: lizardHead.id },
                { trailId: coastalTrail.id, bodyPartId: lizardBody.id },
                // Sentosa Imbiah Trail: Lion (3 parts) + Koel (3 parts) + Beetle (3 parts)
                { trailId: imbiahTrail.id, bodyPartId: lionTail.id },
                { trailId: imbiahTrail.id, bodyPartId: lionHead.id },
                { trailId: imbiahTrail.id, bodyPartId: lionBody.id },
                { trailId: imbiahTrail.id, bodyPartId: koelTail.id },
                { trailId: imbiahTrail.id, bodyPartId: koelHeadBody.id },
                { trailId: imbiahTrail.id, bodyPartId: koelClaws.id },
                { trailId: imbiahTrail.id, bodyPartId: beetleHead.id },
                { trailId: imbiahTrail.id, bodyPartId: beetleBody.id },
                { trailId: imbiahTrail.id, bodyPartId: beetleAntenna.id },
            ],
        });
        console.log('✓ Linked body parts to trails\n');
    } else {
        console.log('✓ Body parts already linked to trails\n');
    }

    // Create questions (check if exist first)
    const existingQuestions = await prisma.question.count();
    if (existingQuestions === 0) {
        // Coastal Trail Questions
        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                question: 'Body part to be earned: Spider Legs',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Spider Legs', correct: true },
                        { description: 'Spider Head', correct: false },
                        { description: 'Spider Body', correct: false },
                        { description: 'Otter Tail', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: spiderLegs.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                question: 'Body part to be earned: Spider Head',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Spider Head', correct: true },
                        { description: 'Spider Legs', correct: false },
                        { description: 'Spider Body', correct: false },
                        { description: 'Otter Head', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: spiderHead.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                question: 'Body part to be earned: Spider Body',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Spider Body', correct: true },
                        { description: 'Spider Legs', correct: false },
                        { description: 'Spider Head', correct: false },
                        { description: 'Otter Body', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: spiderBody.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                question: 'Body part to be earned: Otter Tail',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Otter Tail', correct: true },
                        { description: 'Otter Head', correct: false },
                        { description: 'Otter Body', correct: false },
                        { description: 'Lizard Tail', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: otterTail.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                question: 'Body part to be earned: Otter Head',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Otter Head', correct: true },
                        { description: 'Otter Tail', correct: false },
                        { description: 'Otter Body', correct: false },
                        { description: 'Lizard Head', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: otterHead.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                question: 'Body part to be earned: Otter Body',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Otter Body', correct: true },
                        { description: 'Otter Tail', correct: false },
                        { description: 'Otter Head', correct: false },
                        { description: 'Lizard Body', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: otterBody.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                question: 'Body part to be earned: Lizard Tail',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Lizard Tail', correct: true },
                        { description: 'Lizard Head', correct: false },
                        { description: 'Lizard Body', correct: false },
                        { description: 'Lion Tail', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: lizardTail.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                question: 'Body part to be earned: Lizard Head',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Lizard Head', correct: true },
                        { description: 'Lizard Tail', correct: false },
                        { description: 'Lizard Body', correct: false },
                        { description: 'Lion Head', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: lizardHead.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                question: 'Body part to be earned: Lizard Body',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Lizard Body', correct: true },
                        { description: 'Lizard Tail', correct: false },
                        { description: 'Lizard Head', correct: false },
                        { description: 'Lion Body', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: lizardBody.id }] },
            },
        });

        // Imbiah Trail Questions
        await prisma.question.create({
            data: {
                trailId: imbiahTrail.id,
                question: 'Body part to be earned: Lion Tail',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Lion Tail', correct: true },
                        { description: 'Lion Head', correct: false },
                        { description: 'Lion Body', correct: false },
                        { description: 'Koel Tail', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: lionTail.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: imbiahTrail.id,
                question: 'Body part to be earned: Lion Head',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Lion Head', correct: true },
                        { description: 'Lion Tail', correct: false },
                        { description: 'Lion Body', correct: false },
                        { description: 'Koel Head & Body', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: lionHead.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: imbiahTrail.id,
                question: 'Body part to be earned: Lion Body',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Lion Body', correct: true },
                        { description: 'Lion Tail', correct: false },
                        { description: 'Lion Head', correct: false },
                        { description: 'Beetle Body', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: lionBody.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: imbiahTrail.id,
                question: 'Body part to be earned: Koel Tail',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Koel Tail', correct: true },
                        { description: 'Koel Head & Body', correct: false },
                        { description: 'Koel Claws', correct: false },
                        { description: 'Lion Tail', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: koelTail.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: imbiahTrail.id,
                question: 'Body part to be earned: Koel Head & Body',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Koel Head & Body', correct: true },
                        { description: 'Koel Tail', correct: false },
                        { description: 'Koel Claws', correct: false },
                        { description: 'Beetle Head', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: koelHeadBody.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: imbiahTrail.id,
                question: 'Body part to be earned: Koel Claws',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Koel Claws', correct: true },
                        { description: 'Koel Tail', correct: false },
                        { description: 'Koel Head & Body', correct: false },
                        { description: 'Beetle Antenna', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: koelClaws.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: imbiahTrail.id,
                question: 'Body part to be earned: Beetle Head',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Beetle Head', correct: true },
                        { description: 'Beetle Body', correct: false },
                        { description: 'Beetle Antenna', correct: false },
                        { description: 'Koel Head & Body', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: beetleHead.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: imbiahTrail.id,
                question: 'Body part to be earned: Beetle Body',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Beetle Body', correct: true },
                        { description: 'Beetle Head', correct: false },
                        { description: 'Beetle Antenna', correct: false },
                        { description: 'Lion Body', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: beetleBody.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: imbiahTrail.id,
                question: 'Body part to be earned: Beetle Antenna',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Beetle Antenna', correct: true },
                        { description: 'Beetle Head', correct: false },
                        { description: 'Beetle Body', correct: false },
                        { description: 'Koel Claws', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: beetleAntenna.id }] },
            },
        });
        console.log('✓ Created 18 questions with options\n');
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
                // Give user all of Spider's parts (make Spider completed)
                { userId: user.id, bodyPartId: spiderLegs.id },
                { userId: user.id, bodyPartId: spiderHead.id },
                { userId: user.id, bodyPartId: spiderBody.id },
                // Give user partial Otter parts (2 out of 3)
                { userId: user.id, bodyPartId: otterTail.id },
                { userId: user.id, bodyPartId: otterBody.id },
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
