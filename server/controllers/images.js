import { uploadImageToCloudinary } from "../utility/images.js";

export const uploadImages = async (req, res) => {
    try {
        // req.file is used here because we will use multer's .single() middleware
        const file = req.file; 
        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // Call the new Cloudinary upload utility
        const result = await uploadImageToCloudinary(file);
        
        if (result.success) {
            // Send back the successful response with the URL
            return res.status(200).json(result);
        } else {
            // If the utility returned an error, send a 500 status
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error("Error in uploadImages controller:", error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};