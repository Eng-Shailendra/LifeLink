
import wrapAsync from "../../../middlewares/wrapAsync-middleware.js"
import ApiError from "../../../utils/apiError.js";
import { sendMail } from "../../../utils/sendEmail.js";
import { User } from "../models/auth-model.js"
import bcrypt from "bcrypt";
import generateAuthToken from "../../../utils/generateToken.js"
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

    const htmlformet = verificationEmailTemplate(user._id, verifyUrl)
    await sendMail({
        htmlformet,
        subject: "Verification email",
        email: user.email

    });

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
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) throw new ApiError("Invalid eamil user not found ", 400);
    if (!user.password) throw new ApiError("This account uses social login. Please log in with Google.", 400);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError("Password Invalid password ");

    if (!user.isEmailVerified) throw new ApiError("Please verify email before login ", 403);

    // !2fA
    if (!user.twoFactorEnabled) {
        const token = generateAuthToken(user._id);
        return res.status(200).json({
            success: true,
            requiresOtp: false,
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    }

    const otp = await createVerification(user._id, "loginOtp", { isOtp: true, expiresInMinutes: 5 });
    await sendMail({
        htmlformet: `<p>Your login verification code is:</p><h2>${otp}</h2><p>Expires in 5 minutes.</p>`,
        subject: "Your Life-Link login code",
        email: user.email,
    })
    return res.status(200).json({ success: true, requiresOtp: true, message: "OTP sent to your email" });
})

export const forgetPassword = wrapAsync(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError("invalid detail ")
    const user = await User.findOne({ email });
    if (!user) throw new ApiError("Not found any user from this email ");
    const otp = await createVerification(user._id, "passwordReset", { isOtp: true, expiresInMinutes: 5 });
    await sendMail({
        htmlformet: `<p>Your login verification code is:</p><h2>${otp}</h2><p>Expires in 5 minutes.</p>`,
        subject: "Your Life-Link login code",
        email: user.email,
    })
    res.status(200).json({
        success: true,
        message: "OTP sent to your email",
        data: user._id
    })
})


export const verifyEmailOtp = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { type, otp, } = req.body;

    const user = await User.findById(id);
    if (!user) throw new ApiError("User not found", 400);

    await verifyCode(id, type, otp,); // userId passed since we already know it

    const token = generateAuthToken(id);
    return res.status(200).json({
        success: true,
        token,
        message: "Verification successfull",
        user: { id: user._id, name: user.name, email: user.email },
    });

})

export const updatePassword = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { newPassword, matchedPassword } = req.body;

    if (newPassword !== matchedPassword) throw new ApiError("Password is not matching");
    const salt = await bcrypt.genSalt(10);
    const increptedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate({ _id: id }, { password: increptedPassword });

    return res.status(200).json({
        success: true,
        message: "Passsword change successfully",
    })
})


