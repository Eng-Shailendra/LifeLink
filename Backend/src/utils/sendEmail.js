import nodemailer from "nodemailer";
import ApiError from "./apiError.js";


export const sendMail = async (htmlFromet, email) => {
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_AUTH_USER,
            pass: process.env.GMAIL_SECRET_KEY
        }
    });
    try {
        await mailTransporter.sendMail({
            from: process.env.GMAIL_AUTH_USER,
            to: email,
            subject: "To verify access token",
            html: htmlFromet,
        })
    } catch (err) {
        console.log(err);
        throw new ApiError("Getting error on sending  email ")
    }
}