import mongoose from "mongoose";

export const ConnectDB = async () =>{
  try {
    const con = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB connected: ${con.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Error: ${error}`);
  }
}