import crypto from "crypto";
import { Verification } from "../modules/auth/models/verification-model.js";

const createVerification = async (userId, type, { isOtp = false, expiresInMinutes = 15 } = {}) => {
    const code = isOtp
        ? Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
        : crypto.randomBytes(32).toString("hex");                 // long token

    // remove any old pending verification of the same type first
    await Verification.deleteMany({ userId, type });

    await Verification.create({
        userId,
        type,
        code,
        expiresAt: Date.now() + 1000 * 60 * expiresInMinutes,
    });

    return code;
};

const verifyCode = async (userId, type, code) => {
    const record = await Verification.findOne({
        userId,
        type,
        code,
        expiresAt: { $gt: Date.now() },
    });

    if (!record) throw new Error("Invalid or expired code");

    await Verification.deleteOne({ _id: record._id }); // one-time use
    return true;
};

module.exports = { createVerification, verifyCode };