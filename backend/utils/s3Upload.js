const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'forestfriends';

// Allowed image MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} mimetype - File MIME type
 * @param {string} folder - S3 folder (e.g., 'trails', 'bodyparts', 'zoomed')
 * @returns {Promise<string>} - S3 URL
 */
async function uploadToS3(fileBuffer, originalName, mimetype, folder = '') {
    // Validate file type
    if (!ALLOWED_TYPES.includes(mimetype)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Validate file size
    if (fileBuffer.length > MAX_SIZE) {
        throw new Error('File size exceeds 10MB limit.');
    }

    // Generate unique filename
    const ext = originalName.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const key = folder ? `${folder}/${filename}` : filename;

    // Upload to S3
    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: mimetype,
            ACL: 'public-read',
        },
    });

    await upload.done();

    // Return public URL
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-southeast-1'}.amazonaws.com/${key}`;
}

/**
 * Delete file from S3
 * @param {string} url - S3 URL to delete
 */
async function deleteFromS3(url) {
    if (!url) return;

    // Extract key from URL
    const urlParts = url.split('.amazonaws.com/');
    if (urlParts.length !== 2) return;

    const key = urlParts[1];

    try {
        await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        }));
    } catch (error) {
        console.error('Error deleting from S3:', error);
    }
}

module.exports = { uploadToS3, deleteFromS3 };
