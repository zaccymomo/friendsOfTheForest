const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateImages() {
    try {
        // Update Corey the Hermit Crab
        await prisma.forestFriend.updateMany({
            where: { name: 'Corey the Hermit Crab' },
            data: { imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/hermit.png' }
        });
        

        // Update Kingston the Koel
        await prisma.forestFriend.updateMany({
            where: { name: 'Kingston the Koel' },
            data: { imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/koel.png' }
        });

        // Update Sally the Snail
        await prisma.forestFriend.updateMany({
            where: { name: 'Sally the Snail' },
            data: { imageUrl: 'https://forestfriends.s3.ap-southeast-1.amazonaws.com/snail.png' }
        });

        console.log('Image URLs updated successfully!');
    } catch (error) {
        console.error('Error updating image URLs:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateImages();
