import crypto from "crypto";
import { Verification } from "../modules/auth/models/verification-model.js";

const createVerification = async (userId, type, { isOtp = false, expiresInMinutes = 5 } = {}) => {
    const code = isOtp
        ? Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
        : crypto.randomBytes(32).toString("hex");                  // long random token

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
    const query = { type, code, expiresAt: { $gt: Date.now() } };
    if (userId) query.userId = userId; // only filter by userId if one was actually passed

    const record = await Verification.findOne(query);

    if (!record) throw new Error("Invalid or expired code");

    await Verification.deleteOne({ _id: record._id });
    return record.userId;
};

export { createVerification, verifyCode };