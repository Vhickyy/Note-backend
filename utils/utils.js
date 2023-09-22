import bcrypt from "bcryptjs"

export const hashPassword = async () =>  {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hashPassword(password,salt);
}
export const comparePassword = async (password,hashedPassword) =>  {
    return await bcrypt.compare(password,hashedPassword);
}

export const createOtp = () => {
    const otp = []
    for(let i = 0; i<=6; i++){
        otp.push(Math.floor(Math.random() * 10))
    }
    console.log(otp);
    return otp
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