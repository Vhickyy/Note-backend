import User from "../models/userModel.js";

export const getUser = async (req,res) => {
    const userFound = await User.findById({_id:req.user.userId}).select("-password,-otpCode,-otpExpiry,-forgotPasswordExpiry,-googleID,-isVerified");
    const user = {name:userFound.name,email:userFound.email,profile:userFound.profile,role:userFound.role}
    res.status(200).json({msg:"successful",user});
}