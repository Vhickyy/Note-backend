// import nodemailer from "nodemailer";

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