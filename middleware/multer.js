const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");



if (!cloudinary || !cloudinary.config) {
    throw new Error("Cloudinary configuration is missing. Check your .env file.");
  }
  
// Set up Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "book-covers", // Folder in cloudinary
    allowedFormats: ["jpg", "png", "jpeg"], // Allowed file types
    public_id: file.originalname.split(".")[0], // Use filename as public_id
    resource_type: "image"
  }),
});



const upload = multer({ storage });
console.log("✅ Multer Config Loaded: Image uploads should work!");

module.exports = upload;
