import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    authProvider: {
        type: String,
        enum: ["local", "google", "facebook"],
        default: "local",
    },
    providerId: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);