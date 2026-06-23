import nodemailer from "nodemailer";
import ApiError from "./apiError.js";


export const sendMail = async (data) => {
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_AUTH_USER,
            pass: process.env.GMAIL_SECRET_KEY
        }
    });
    try {
        console.log("mail data  ", data)
        await mailTransporter.sendMail({
            from: process.env.GMAIL_AUTH_USER,
            to: data.email,
            subject: data.subject || "To verify access token",
            html: data.htmlformet,
        })
    } catch (err) {
        console.log(err);
        throw new ApiError("Getting error on sending  email ", 400)
    }
}