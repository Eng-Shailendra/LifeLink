import { Router } from "express";
import * as authController from "../controller/auth-controller.js"


const router = Router();

router.post("/register", authController.register);
router.post("/verify-email/:token", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/forget-password", authController.forgetPassword);
router.post("/verify-otp/:id", authController.verifyEmailOtp);
router.post("/update-password/:id", authController.updatePassword)

export default router;


