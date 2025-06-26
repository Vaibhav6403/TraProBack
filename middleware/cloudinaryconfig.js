const cloudinary = require("cloudinary").v2; 
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploads = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            folder: folder
        });

        return {
            url: result.secure_url,
            id: result.public_id
        };
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};
