// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'iqqbkj9k', // e.g., 'learnova-mooc'
  api_key: '774685196361666',
  api_secret: 'ElJbDuk7wkR1qFlA54EtnN7hOHI'
});

module.exports = cloudinary;