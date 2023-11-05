import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createOtp = () => {
    const otpCode = []
    for( let i = 0; i < 6; i++){
        otpCode.push(Math.floor(Math.random() * 10))
    }
    console.log(otpCode);
    return otpCode;
}

export const hashPassword = async (password) =>  {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt);
}

export const comparePassword = async (password,hashedPassword) =>  {
    return await bcrypt.compare(password,hashedPassword);
}

export const createJWT = (payload) => {
 const token = jwt.sign(payload,process.env.SECRET)
 return token;   
}
export const verifyJWT = (payload) => {
 const decoded = jwt.verify(payload)
 return decoded;   
}