import mongoose from "mongoose";

import {config} from "./config.ts"

const connectDB = async () => {
  try { 

    mongoose.connection.on("connected", () => {
      console.log("Database Connected successfully")
    })

    mongoose.connection.on("error", (error) => {
      console.error("Error in connecting to database", error)
    })


    await mongoose.connect(config.databaseUrl as string);

  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1)
  }
}


export default connectDB; 