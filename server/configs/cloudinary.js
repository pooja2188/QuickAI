import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config'; // Ensures environment variables are loaded immediately

// Configuration initializes instantly when this file is imported anywhere
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});


console.log("🚀 Cloudinary instance configured successfully.");

// Export the pre-configured instance instead of an empty function
export default cloudinary;
