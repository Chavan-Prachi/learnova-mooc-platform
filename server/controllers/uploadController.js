const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (filePath, folder = 'learnova_courses') => {
  try {
    // Check file extension
    const fileExt = filePath.split('.').pop().toLowerCase();
    
    // Determine resource type
    let resourceType = 'auto';
    if (['pdf'].includes(fileExt)) {
      resourceType = 'raw'; // PDFs MUST be uploaded as raw!
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
      resourceType = 'image';
    } else if (['mp4', 'mov', 'avi', 'webm'].includes(fileExt)) {
      resourceType = 'video';
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: resourceType, // This is critical!
    });

    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

module.exports = uploadFile;