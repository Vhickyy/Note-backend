import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;
const OAuth2_Client = new OAuth2(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET);
OAuth2_Client.setCredentials({refresh_token:process.env.REFRESH_TOKEN})

export const sendEmail = async ({type,email, message}) => {
  const accessToken = await OAuth2_Client.getAccessToken()
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });
    await transporter.sendMail({
        from: '"Victoria from note app" <victoriaokonnah@gmail.com>',
        to: email, 
        subject: type === "verify" ? "Please verify your account" : "Reset Password",
        html: `<b>${message}</b>`,
    });
}