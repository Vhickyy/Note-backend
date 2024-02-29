import User from "../models/userModel.js";
import { createOtp, hashPassword, comparePassword, createJWT } from "../utils/utils.js";
import { sendEmail } from "../services/nodemailer.js";

export const registerUser = async (req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user){
        res.status(400);
        throw new Error("Email already exist");
    }
    const otpCode = createOtp();
    req.body.password = await hashPassword(password);
    req.body.otpCode = otpCode;
    req.body.otpExpiry = new Date(Date.now() + (1000 * 60));
    console.log(email);
    await sendEmail({type:"verify",email,message:otpCode});
    console.log("sending");
    await User.create(req.body)
    return res.status(201).json({msg:"User succesfully created, verify your account."});
}

export const verifyOtp = async (req,res) => {
    const {email,otpCode} = req.body;
    const user = await User.findOne({email});
    if(!user){
        res.status(400);
        throw new Error("No user with this email");
    }
    if(user.isVerified){
        res.status(400);
        throw new Error("user already verified");
    }
    const isCorrectOtp = user.otpCode === otpCode;
    if(!isCorrectOtp){
        res.status(400);
        throw new Error("Incorrect otpCode");
    }
    const expiredOtp = new Date(user.otpExpiry) < new Date(Date.now());
    console.log(new Date(user.otpExpiry),new Date(Date.now()));
    console.log(expiredOtp);
    if(expiredOtp){
        return res.status(400).json({msg:"otp expired"})
    }
    user.otpCode = "";
    user.isVerified = true
    await user.save();
    return res.status(200).json({msg:"Email verified"});
}

export const loginUser = async (req,res) => {
    const {email,password} = req.body;
    console.log("ji");
    const user = await User.findOne({email});
    if(!user){
        res.status(400);
        throw new Error("Invalid email and password");
    };
    if(!user.isVerified){
        return res.status(400).json({msg:"Please Verify Account"});
    }
    const isCorrectPassword = await comparePassword(password, user.password);
    if(!isCorrectPassword){
        res.status(400);
        throw new Error("Invalid email and password");
    };
    user.triedForgotPassword = false;
    await user.save()
    const token = createJWT({userId: user._id,userRole: user.role})
    const sendUser = {name:user.name,email:user.email,profile:user.profile,role:user.role,id:user._id}
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
        secure: true,
        sameSite: 'none',
        domain: "https://veenotes.netlify.app",
        // secure: process.env.NODE_ENV === "production",
        signed: true
    })
    // console.log(token);
    // console.log(res.cookie);
    return res.status(200).json({msg:"Login successful",user:sendUser});
}

export const logoutUser = async (req,res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    return res.status(200).json({msg:"Logout successful"});
}

export const resendOtp = async (req,res) => {
    const {email} = req.body
    const user = await User.findOne({email});
    if(!user){
        res.status(400)
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
    await sendEmail({type:"verify",email,message:otpCode});
    return res.status(200).json({msg:"otp resent",msg:otpCode});
}

export const forgotPassword = async (req,res) => { 
    const {email} = req.body
    const user = await User.findOne({email});
    console.log("hi1");
    if(!user){
        res.status(400)
        throw new Error("user does not exist")
    }
    if(!user.isVerified){
        return res.status(400).json({msg:"Please verify your account before you perform this action"})
    }
    const otpCode = createOtp();
    user.triedForgotPassword = true;
    user.passwordOtp = otpCode;
    user.passwordExpiry = new Date(Date.now() + (1000 * 60));
    await user.save();
    await sendEmail({type:"verify",email,message:otpCode});
    console.log("send");
    return res.status(200).json({msg:"otp resent",msg:otpCode});
}

export const verifyForgotPassword = async (req,res) => {
    const {email,otpCode} = req.body;
    console.log(email,otpCode);
    if(!otpCode){
        res.status(400)
        throw new error("otp is required")
    }
    const user = await User.findOne({email});
    if(!user){
        res.status(400);
        throw new Error("No user with this email");
    }
    const isCorrectOtp = user.passwordOtp === otpCode;
    console.log(user.passwordOtp);
    if(!isCorrectOtp){
        res.status(400); 
        throw new Error("Incorrect otpCode");
    }
    const expiredOtp = new Date(user.passwordExpiry) < new Date(Date.now());
    if(expiredOtp){
        return res.status(400).json({msg:"otp expired"})
    }
    user.passwordOtp = "";
    user.passwordExpiry = "";
    await user.save()
    return res.status(200).json({msg:"otp code correct"})
}

export const resendPasswordOtp = async (req,res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        res.status(400)
        throw new Error("user does not exist")
    }
    // if(!user.isVerified){
    //     return res.status(400).json({msg:"Please verify your account before you perform this action"})
    // }
    // Check if its time to resend otp here
    const otpCode = createOtp();
    user.passwordOtp = otpCode;
    user.passwordExpiry = new Date(Date.now() + (1000 * 60));
    await user.save();
    await sendEmail({type:"verify",email,message:otpCode});
    console.log("send");
    return res.status(200).json({msg:otpCode});
}

export const resetPassword = async (req,res) => {
    const {email,password} = req.body;
    if(!password){
        res.status(400)
        throw new Error("Password is required")
    }
    const user = await User.findOne({email});
    if(!user){
        res.status(400)
        throw new Error("user does not exist")
    }
    if(!user.triedForgotPassword){
        res.status(400)
        throw new Error("cannot perform this action")
    }
    const hashedPassword = await hashPassword(password);
    user.password =  hashedPassword;
    user.triedForgotPassword = false;
    await user.save();
    return res.status(200).json({msg:"password changed successfully"});
}