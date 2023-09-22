import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    profile: String,
    isVerified: Boolean,
    otpCode: String,
    otpExpiry: Date,
    forgotPasswordExpiry: Date
})

export default mongoose.model("User",UserSchema);