import mongoose from "mongoose";
// import { type } from "node:os";


const verificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: ["emailVerify", "passwordReset", "loginOtp", "phoneVerify", "otp"],
        required: true,
    },
    code: { type: String, required: true },   // token OR 6-digit OTP, doesn't matter
    expiresAt: { type: Date, required: true },
}, {
    timestamps: true
})

export const Verification = mongoose.model("Verification", verificationSchema);