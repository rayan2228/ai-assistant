import mongoose, { Schema } from "mongoose";

interface IUser {
  googleId: string;
  email: string;
  verified_email: boolean;
  name: string;
  picture: string;
}

const userSchema = new Schema<IUser>({
  googleId: String,
  email: String,
  verified_email: Boolean,
  name: String,
  picture: String,
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
