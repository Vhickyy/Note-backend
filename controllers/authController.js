import User from "../models/userModel.js";
import { createOtp, hashPassword, comparePassword } from "../utils/utils.js";
import { sendEmail } from "../services/nodemailer.js";
export const registerUser = async (req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user){
        res.status(401);
        throw new Error("Email already exist");
    }
    const otpCode = createOtp();
    req.body.password = await hashPassword(password);
    req.body.otpCode = otpCode;
    req.body.otpExpiry = new Date(Date.now() + (1000 * 60));
    await User.create(req.body)
    // await sendEmail({type:"verify",email,message:otpCode});
    return res.status(201).json({msg:"User succesfully created, verify your account."});
}

export const verifyOtp = async (req,res) => {
    const {email,otpCode} = req.body;
    const user = await User.findOne({email});
    if(!user){
        res.status(401);
        throw new Error("No user with this email");
    }
    const isCorrectOtp = user.otpCode === otpCode;
    if(!isCorrectOtp){
        res.status(401);
        throw new Error("Incorrect otpCode");
    }
    const expiredOtp = user.expiredOtp < new Date(Date.now());
    if(expiredOtp){
        return res.status(200).json({msg:"otp expired"})
    }
    user.otpCode = "";
    await user.save();
    return res.status(200).json({msg:"Email verified"});
}

export const loginUser = async (req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        res.status(401);
        throw new Error("Invalid email and password");
    };
    if(!user.isVerified){
        return res.status(200).json({msg:"Please Verify Account"});
    }
    const isCorrectPassword = await comparePassword(password, user.password);
    if(!isCorrectPassword){
        res.status(401);
        throw new Error("Invalid email and password");
    };
    return res.status(200).json({msg:"Login successful",data:user});
}

export const resendOtp = async (req,res) => {
    const {email} = req.body
    const user = await User.findOne({email});
    // Check if its time to resend otp here
    const otpCode = createOtp();
    user.otpCode = otpCode;
    user.otpExpiry = new Date.now() + (1000 * 60);
    await user.save();
    await sendEmail({type:"verify",email,message:otpCode});
    res.send("resend otp");
    return res.status(200).json({msg:"otp resent",msg:otpCode});
}