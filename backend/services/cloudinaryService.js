const cloudinary = require('cloudinary').v2;

let isCloudinaryConfigured = false;
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    isCloudinaryConfigured = true;
    console.log('Cloudinary service configured successfully.');
} else {
    console.warn('Cloudinary environment variables missing (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Using mock image URLs.');
}

const uploadImage = async (fileData, fileName) => {
    if (!isCloudinaryConfigured) {
        throw new Error('Image upload service is not configured');
    }
    const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(fileData || '');
    if (!match) throw new Error('Only JPEG, PNG, and WebP image uploads are allowed');
    if (Buffer.byteLength(match[2], 'base64') > 5 * 1024 * 1024) throw new Error('Image must be 5 MB or smaller');
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            fileData,
            { public_id: fileName, folder: 'erevive_donations', resource_type: 'image', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error.message);
                    return reject(error);
                }
                resolve(result.secure_url);
            }
        );
    });
};

module.exports = { uploadImage };
