import {Router} from "express";
import {registerUser,loginUser,verifyOtp,resendOtp, logoutUser, forgotPassword, resendPasswordOtp, resetPassword, verifyForgotPassword} from "../controllers/authController.js";
import {registerValidation, loginValidation, verifyOtpValidation, resendOtpValidation} from "../middlewares/validationMiddleware.js"
const router = Router();

router.post("/register",registerValidation,registerUser);
router.post("/login",loginValidation,loginUser);
router.post("/verify-email",verifyOtpValidation,verifyOtp);
router.post("/resend-otp",resendOtpValidation,resendOtp);
router.post("/forgot-password",resendOtpValidation,forgotPassword);
router.post("/resend-password-otp",resendOtpValidation,resendPasswordOtp);
router.post("/verify-password-otp",resendOtpValidation,verifyForgotPassword);
router.post("/reset-password",resendOtpValidation,resetPassword);
router.get("/logout",logoutUser);

export default router;