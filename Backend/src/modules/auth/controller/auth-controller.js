
import wrapAsync from "../../../middlewares/wrapAsync-middleware.js"
import ApiError from "../../../utils/apiError.js";
import { sendMail } from "../../../utils/sendEmail.js";
import { User } from "../models/auth-model.js"
import bcrypt from "bcrypt";
import { accessToken, refreshToken } from "../../../utils/generateToken.js"
import { verificationEmailTemplate } from "../../../utils/templates/email-template.js";
import { createVerification, verifyCode } from "../../../utils/verification.js";



export const register = wrapAsync(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new ApiError("All filds are required", 400);
    }
    const existUser = await User.findOne({ email });
    if (existUser)
        if (existUser.isEmailVerified) throw new ApiError("User already exist", 400);

    const salt = await bcrypt.genSalt(10);
    const increptedPassword = await bcrypt.hash(password, salt);


    const user = new User({
        name, email, password: increptedPassword,
    })
    await user.save();


    const token = await createVerification(user._id, "emailVerify", { isOtp: false, expiresInMinutes: 1440 })
    console.log("this is email verify token", token);


    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`

    const htmlforment = verificationEmailTemplate(user._id, verifyUrl)
    await sendMail(htmlforment, user.email);

    // accessToken(user._id);
    // refreshToken(user._id);
    res.status(200).json({
        success: true,
        message: "User register successfully",
    })
})

export const verifyEmail = wrapAsync(async (req, res) => {
    const { token } = req.params;
    console.log("param token ", token)
    const userId = await verifyCode(null, "emailVerify", token);
    await User.findByIdAndUpdate(userId, { isEmailVerified: true });
    res.status(200).json({
        success: true,
        message: "Email verified Successfully"
    })
})



export const login = wrapAsync(async (req, res) => {

})

export const forgetPassword = wrapAsync(async (req, res) => {

})

export const sendEmailOtp = wrapAsync(async (req, res) => {

})

export const verifyEmailOtp = wrapAsync(async (req, res) => {

})

export const updatePassword = wrapAsync(async (req, res) => {

})


