import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  otp: string;
  otpExpires: number;
  role: "user" | "admin"; // added
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
 otp: { type: String, default: null },
  otpExpires: { type: Number, default: null },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // added
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
