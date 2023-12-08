import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    profile: String,
    role: {
        type: String,
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    googleID: String,
    otpCode: String,
    otpExpiry: Date,
    forgotPasswordExpiry: Date,
})

export default mongoose.model("User",UserSchema);