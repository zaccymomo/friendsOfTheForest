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
                imageUrl: forestFriendAssets.spider.outline,
                imageFULL: forestFriendAssets.spider.full,
            },
        });
        console.log('✓ Created forest friend: Spider');
    } else {
        spider = await prisma.forestFriend.update({
            where: { id: spider.id },
            data: { imageFULL: forestFriendAssets.spider.full },
        });
        console.log('✓ Forest friend already exists: Spider');
    }

    let otter = await prisma.forestFriend.findFirst({
        where: { name: 'Otter' }
    });
    if (!otter) {
        otter = await prisma.forestFriend.create({
            data: {
                name: 'Otter',
                imageUrl: forestFriendAssets.otter.outline,
                imageFULL: forestFriendAssets.otter.full,
            },
        });
        console.log('✓ Created forest friend: Otter');
    } else {
        otter = await prisma.forestFriend.update({
            where: { id: otter.id },
            data: { imageFULL: forestFriendAssets.otter.full },
        });
        console.log('✓ Forest friend already exists: Otter');
    }

    let lizard = await prisma.forestFriend.findFirst({
        where: { name: 'Lizard' }
    });
    if (!lizard) {
        lizard = await prisma.forestFriend.create({
            data: {
                name: 'Lizard',
                imageUrl: forestFriendAssets.lizard.outline,
                imageFULL: forestFriendAssets.lizard.full,
            },
        });
        console.log('✓ Created forest friend: Lizard');
    } else {
        lizard = await prisma.forestFriend.update({
            where: { id: lizard.id },
            data: { imageFULL: forestFriendAssets.lizard.full },
        });
        console.log('✓ Forest friend already exists: Lizard');
    }

    let lion = await prisma.forestFriend.findFirst({
        where: { name: 'Lion' }
    });
    if (!lion) {
        lion = await prisma.forestFriend.create({
            data: {
                name: 'Lion',
                imageUrl: forestFriendAssets.lion.outline,
                imageFULL: forestFriendAssets.lion.full,
            },
        });
        console.log('✓ Created forest friend: Lion');
    } else {
        lion = await prisma.forestFriend.update({
            where: { id: lion.id },
            data: { imageFULL: forestFriendAssets.lion.full },
        });
        console.log('✓ Forest friend already exists: Lion');
    }

    let koel = await prisma.forestFriend.findFirst({
        where: { name: 'Koel' }
    });
    if (!koel) {
        koel = await prisma.forestFriend.create({
            data: {
                name: 'Koel',
                imageUrl: forestFriendAssets.koel.outline,
                imageFULL: forestFriendAssets.koel.full,
            },
        });
        console.log('✓ Created forest friend: Koel');
    } else {
        koel = await prisma.forestFriend.update({
            where: { id: koel.id },
            data: { imageFULL: forestFriendAssets.koel.full },
        });
        console.log('✓ Forest friend already exists: Koel');
    }

    let beetle = await prisma.forestFriend.findFirst({
        where: { name: 'Beetle' }
    });
    if (!beetle) {
        beetle = await prisma.forestFriend.create({
            data: {
                name: 'Beetle',
                imageUrl: forestFriendAssets.beetle.outline,
                imageFULL: forestFriendAssets.beetle.full,
            },
        });
        console.log('✓ Created forest friend: Beetle\n');
    } else {
        beetle = await prisma.forestFriend.update({
            where: { id: beetle.id },
            data: { imageFULL: forestFriendAssets.beetle.full },
        });
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

    // Create zones (check if exist first)
    let zone1 = await prisma.zone.findFirst({ where: { id: 1 } });
    if (!zone1) {
        zone1 = await prisma.zone.create({
            data: {
                id: 1,
                narrative: 'You meet Kingston the Koel, who has gotten lost among the sea of trees. A little birdy heard him rustling amongst the trees near the entrance… Perhaps that might be a good place to look?',
            },
        });
    }

    let zone2 = await prisma.zone.findFirst({ where: { id: 2 } });
    if (!zone2) {
        zone2 = await prisma.zone.create({
            data: {
                id: 2,
                narrative: "You encounter Larry the Lion, who has wandered off into the trees, hungry and drawn in by fruit-bearing trees like Sea Apple heritage, Sparrow's Mango, Percha, Seashore Mangosteen tree…",
            },
        });
    }

    let zone3 = await prisma.zone.findFirst({ where: { id: 3 } });
    if (!zone3) {
        zone3 = await prisma.zone.create({
            data: {
                id: 3,
                narrative: 'Tina the Tiger Beetle and Osborne the Otter have made friends with species that live near the beach, including rare birds like the Atlas Emerald Cuckoo and Buffy Fish Owl. Osborne was last seen near a tall structure by the river, while some have seen Tina atop a flight of stairs apparently?',
            },
        });
    }

    let zone4 = await prisma.zone.findFirst({ where: { id: 4 } });
    if (!zone4) {
        zone4 = await prisma.zone.create({
            data: {
                id: 4,
                narrative: 'Ming the Monitor Lizard was apparently last seen stacking rocks somewhere in the trail….He sure does love his rocks! I wonder where that is…',
            },
        });
    }
    console.log('✓ Ensured 4 zones exist\n');

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

    // Create questions (check if exist first)
    const existingQuestions = await prisma.question.count();
    if (existingQuestions === 0) {

        // --- Zone 1: Entrance (Kingston the Koel) ---

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 1,
                question: 'Kingston seems to be following a bird that is black and white and likes to sing! You can probably hear it if you try hard enough! Which bird is Kingston trying to find?',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Pink-necked Green Pigeon', correct: false },
                        { description: 'Oriental Magpie Robin', correct: true },
                        { description: 'Peacock', correct: false },
                        { description: 'Hummingbird', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: koelTail.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 1,
                question: 'Kingston finds a moult of some sort of animal…What animal could the moult belong to?',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Housefly', correct: false },
                        { description: 'Rhinoceros Beetle', correct: false },
                        { description: 'Cicada', correct: true },
                        { description: 'Bee', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: koelHeadBody.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 1,
                question: 'Kingston read on a board somewhere that some of the patterns on plants had inspired people like architects and designers in their works! Which of the plants have done so?',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Fiddlehead', correct: true },
                        { description: "Bird's Nest Fern", correct: false },
                        { description: 'Coconut Tree', correct: false },
                        { description: 'Apple Tree', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: koelClaws.id }] },
            },
        });

        // --- Zone 2: Web of Wonders (Larry the Lion) ---

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 2,
                question: 'Larry followed the scent of fruits deeper into the trees. Which of the following points is correct about the seashore mangosteen?',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'They do not have edible parts', correct: false },
                        { description: 'They are not endangered at all', correct: false },
                        { description: 'The leaves of its trees provide shelter for bats and birds', correct: true },
                        { description: 'The seashore mangosteen is sweet to the taste', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: lionTail.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 2,
                question: "Larry spots this fruit on a tree that looks like the brain of a shrimp! What is it?",
                type: 'MCQ',
                options: {
                    create: [
                        { description: "Sparrow's Mango", correct: true },
                        { description: 'Apple', correct: false },
                        { description: 'Rambutan', correct: false },
                        { description: 'Durian', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: lionHead.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 2,
                question: 'Larry finally tastes the seashore mangosteen and he loves it! He describes the taste as:',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Sweet and tangy', correct: false },
                        { description: 'Bitter and dry', correct: false },
                        { description: 'Sour, tastes like apples or peaches', correct: true },
                        { description: 'Spicy, like chillis and peppers', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: lionBody.id }] },
            },
        });

        // --- Zone 3: Scenic Overlook (Tina the Tiger Beetle) ---

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 3,
                question: 'Tina likes to climb stairs! She gets to see the entire ocean from there! How many totem poles did Tina spot along the ocean front?',
                type: 'MCQ',
                options: {
                    create: [
                        { description: '3', correct: false },
                        { description: '4', correct: false },
                        { description: '5', correct: false },
                        { description: '6', correct: true },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: beetleHead.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 3,
                question: "Tina reads on a signboard that there is an island not too far away from Sentosa that was constructed to preserve Singapore's rich marine life, as well as spearhead research on marine life. Which island is this?",
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Pulau Semakau', correct: false },
                        { description: 'Pulau Kambing', correct: false },
                        { description: "Sisters' Islands Marine Park", correct: true },
                        { description: 'Pulau Tekong', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: beetleBody.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 3,
                question: 'Tina likes to hang around the Sea Almond Tree, which is pagoda-shaped in form and has large spoon-shaped leaves. The almond-shaped fruits are dispersed (spread) by:',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Air', correct: false },
                        { description: 'Explosion (Explosive Dispersal)', correct: false },
                        { description: 'Animals and Water', correct: true },
                        { description: 'Humans', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: beetleAntenna.id }] },
            },
        });

        // --- Zone 3: Scenic Overlook (Osborne the Otter) ---

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 3,
                question: 'Osborne likes to hang out around the edge of the waters and looks toward the buildings…He often wonders what is the name of the place where the cable cars come out of. What is this place?',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Resorts World Sentosa', correct: false },
                        { description: 'Vivocity', correct: false },
                        { description: 'Harbourfront Tower', correct: true },
                        { description: 'Keppel Harbour', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: otterTail.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 3,
                question: 'Osborne likes to read the signboards and the wealth of knowledge that they hold! He realises that one of the locations near the trail was actually named after a certain Admiral…Which place is this?',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Fort Siloso', correct: false },
                        { description: 'Keppel Harbour', correct: true },
                        { description: 'Sentosa Cove', correct: false },
                        { description: 'One Degree 15 Sentosa', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: otterHead.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 3,
                question: 'Osborne the otter likes to hang around near the edge of the waters, and swims in the ocean often with his family! People often spot otters around the waterways and in rivers. What should you do if you spot otters?',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Take out your phone and take a picture with the flash on', correct: false },
                        { description: 'Offer food to the otters', correct: false },
                        { description: 'Chase them', correct: false },
                        { description: 'Maintain a safe distance and appreciate how cute they are!', correct: true },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: otterBody.id }] },
            },
        });

        // --- Zone 4: Rocky Retreat (Ming the Monitor Lizard) ---

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 4,
                question: 'Ming was seen stacking and resting near granite rocks. He is also known to appreciate the works of one of the artists that came up with the structure. He is apparently a British TV and radio comedian? What is his name?',
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Adrian Gray', correct: false },
                        { description: 'Andy Goldsworthy', correct: false },
                        { description: 'Richard Roy', correct: false },
                        { description: 'Dave Gorman', correct: true },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: lizardTail.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 4,
                question: "Ming loves hanging out around the water's edge near the stacking rocks too! It's cooling and refreshing. He peers into the water and sees patches of grass, swaying with waves…What kind of marine habitat is that?",
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Seagrass beds', correct: true },
                        { description: 'Seaweed farms', correct: false },
                        { description: 'Coral reef', correct: false },
                        { description: 'Sandy and rocky shores', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: lizardHead.id }] },
            },
        });

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: 4,
                question: "Ming often sees a rocky coast and shoreline to the left of the stacking rocks, a way off into the distance. Apparently it's one of the last rocky shore environments in Singapore! He doesn't remember what it's called…Tanjong…? What is it called?",
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Tanjong Pagar', correct: false },
                        { description: 'Tanjong Katong', correct: false },
                        { description: 'Tanjong Rimau', correct: true },
                        { description: 'Tanjong Rhu', correct: false },
                    ],
                },
                bodyParts: { create: [{ bodyPartId: lizardBody.id }] },
            },
        });

        // --- Bonus (no zone) ---

        await prisma.question.create({
            data: {
                trailId: coastalTrail.id,
                zoneId: null,
                question: "As you finish the trail, and as the friends finally reunite, you notice something quietly linking the forest, rocks, and coastal plants together…\n\nYou've stepped into the spider's web! What do Golden Orb Weavers eat?",
                type: 'MCQ',
                options: {
                    create: [
                        { description: 'Insects', correct: true },
                        { description: 'Small mammals', correct: false },
                        { description: 'Birds', correct: false },
                        { description: 'Fruits', correct: false },
                    ],
                },
                bodyParts: {
                    create: [
                        { bodyPartId: spiderLegs.id },
                        { bodyPartId: spiderHead.id },
                        { bodyPartId: spiderBody.id },
                    ],
                },
            },
        });

        console.log('✓ Created 16 questions with options\n');
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
