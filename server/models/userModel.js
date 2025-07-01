import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    authProvider: {
      type: String,
      enum: ["google", "github", "facebook"],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
