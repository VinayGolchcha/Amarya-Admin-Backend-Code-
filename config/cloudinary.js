import dotenv from 'dotenv';
dotenv.config();
import {v2 as cloudinary} from 'cloudinary';

export let cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})
.promise();
export default cloudinaryConfig;