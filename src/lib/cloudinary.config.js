import dotenv from "dotenv";
dotenv.config();
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "duj0ly0ul", //process.env.CLOUNINARY_NAME,
  api_key: "134488293674341", //process.env.CLOUNINARY_API_KEY,
  api_secret: "HxG2Z3FiMk1YTckdRBbyIGUJrVs", //process.env.CLOUNINARY_API_SECRET,
  default_folder: "Root", // Set default folder here
});

export default cloudinary;
