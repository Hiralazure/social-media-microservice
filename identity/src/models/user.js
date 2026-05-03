import mongoose from "mongoose";
import argon2 from "argon2";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await argon2.hash(this.password);
    } catch (error) {
      return next(error);
    }
  }
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (e) {
    throw error;
  }
};
userSchema.index({ username: "text" });
export const userModel = mongoose.model("User", userSchema);
