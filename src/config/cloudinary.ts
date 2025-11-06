import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.ts";

cloudinary.config({
  cloud_name: config.cloudinaryCloud as string,
  api_key: config.cloudinaryApiKey as string,
  api_secret: config.cloudinarySecretKey as string,
});

export default cloudinary;
