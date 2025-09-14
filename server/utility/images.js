import { v2 as cloudinary } from 'cloudinary';
import DatauriParser from 'datauri/parser.js';
import path from 'path';

// Configure Cloudinary with your credentials from the .env file
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const parser = new DatauriParser();

/**
 * Uploads a single file buffer to Cloudinary.
 * @param {object} file - The file object from Multer (req.file).
 * @returns {Promise<object>} An object with the success status and the image URL.
 */
export const uploadImageToCloudinary = async (file) => {
    try {
        if (!file) {
            throw new Error("No file provided for upload.");
        }

        // Format the buffer into a Data URI string that Cloudinary can accept
        const fileExtension = path.extname(file.originalname).toString();
        const formattedFile = parser.format(fileExtension, file.buffer).content;

        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(formattedFile, {
            resource_type: "image",
            // You can add folder names or other upload options here
            // folder: "hostelbuddy_products" 
        });

        // Return a clean object with the secure URL
        return {
            success: true,
            url: result.secure_url
        };

    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return {
            success: false,
            message: 'Error uploading image.',
            error: error.message
        };
    }
};