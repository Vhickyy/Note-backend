import bcrypt from "bcryptjs";
import nodemailer from "nodemiler";

export const hashPassword = async (password) =>  {
    const salt = await bcrypt.genSalt(10);
    // return await bcrypt.hashPassword(password,salt);
    return await bcrypt.hash(password,salt);
}
export const comparePassword = async (password,hashedPassword) =>  {
    return await bcrypt.compare(password,hashedPassword);
}

export const createOtp = () => {
    const otp = []
    for(let i = 0; i<=6; i++){
        otp.push(Math.floor(Math.random() * 10))
    }
    return otp.join("");
}

export const sendEmail = async ({type,email, message}) => {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    });
    await transporter.sendMail({
        from: '"Victoria from note app" <victoriaokonnah@gmail.com>',
        to: email, 
        subject: type === "verify" ? "Please verify your account" : "Reset Password",
        html: `<b>${message}</b>`,
    });
}

export const createJWT = () => {
    
}