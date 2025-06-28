import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB connected`);
  } catch (error) {
    console.error(`MongoDB not connected due to {error.message}`);
  }
};

export default connectDB;
