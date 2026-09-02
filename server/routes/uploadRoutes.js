const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Handle both 'image' and 'file' uploads
router.post('/', protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), async (req, res) => {
  try {
    const fileToUpload = req.files.image ? req.files.image[0] : req.files.file ? req.files.file[0] : null;
    
    if (!fileToUpload) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const b64 = Buffer.from(fileToUpload.buffer).toString('base64');
    const dataURI = `data:${fileToUpload.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'learnova_courses',
      resource_type: 'auto'
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;