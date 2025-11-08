import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
  cloudinarySecretKey: process.env.CLOUDINARY_SECRET_KEY,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  frontendOrigin: process.env.FRONTEND_DOMAIN,
};

export const config = Object.freeze(_config)