import User from "../models/userModel.js";

export const getUser = async (req,res) => {
    const userFound = await User.findById({_id:req.user.userId}).select("-password,-otpCode,-otpExpiry,-forgotPasswordExpiry,-googleID,-isVerified");
    const user = {name:userFound.name,email:userFound.email,profile:userFound.profile,role:userFound.role,id:userFound._id}
    res.status(200).json({msg:"successful",user});
}
export const getAllUser = async (req,res) => {
    const userFound = await User.find({}).select("-password,-otpCode,-otpExpiry,-forgotPasswordExpiry,-googleID,-isVerified");
    // const user = {name:userFound.name,email:userFound.email,profile:userFound.profile,role:userFound.role,id:userFound._id}
    res.status(200).json({msg:"successful",userFound});
}