import nodemailer from "nodemailer";
import errorMiddleware from "../middlewares/error-middleware";


const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_AUTH_USER,
        pass: process.env.GMAIL_API_KEY
    }
});


export const sendMail = async (htmlFromet, email) => {
    try {
        await mailTransporter.sendMail({
            from: GMAIL_AUTH_USER,
            to: email,
            subject: "To verify access token",
            html: htmlFromet, 
        })
    } catch (err) {
        errorMiddleware(err);
    }
}