import User from "../models/userModel.js";
import { createOtp, hashPassword, comparePassword, createJWT } from "../utils/utils.js";
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
    if(user.isVerified){
        res.status(401);
        throw new Error("user already verified");
    }
    const isCorrectOtp = user.otpCode === otpCode;
    if(!isCorrectOtp){
        res.status(401);
        throw new Error("Incorrect otpCode");
    }
    const expiredOtp = new Date(user.otpExpiry) < new Date(Date.now());
    console.log(new Date(user.otpExpiry),new Date(Date.now()));
    console.log(expiredOtp);
    if(expiredOtp){
        return res.status(401).json({msg:"otp expired"})
    }
    user.otpCode = "";
    user.isVerified = true
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
        return res.status(401).json({msg:"Please Verify Account"});
    }
    const isCorrectPassword = await comparePassword(password, user.password);
    if(!isCorrectPassword){
        res.status(401);
        throw new Error("Invalid email and password");
    };
    const token = createJWT({userId: user._id,userRole: user.role})
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
        secure: process.env.NODE_ENV === "production"
    })
    return res.status(200).json({msg:"Login successful"});
}

export const resendOtp = async (req,res) => {
    const {email} = req.body
    const user = await User.findOne({email});
    if(!user){
        res.status(401)
        throw new Error("user does not exist")
    }
    if(user.isVerified){
        return res.status(200).json({msg:"user already verified"});
    }
    // Check if its time to resend otp here
    const otpCode = createOtp();
    user.otpCode = otpCode;
    user.otpExpiry = new Date(Date.now() + (1000 * 60));
    await user.save();
    // await sendEmail({type:"verify",email,message:otpCode});
    return res.status(200).json({msg:"otp resent",msg:otpCode});
}