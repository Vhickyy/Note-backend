import {Router} from "express";
import {registerUser,loginUser,verifyOtp,resendOtp, logoutUser} from "../controllers/authController.js";
import {registerValidation, loginValidation, verifyOtpValidation, resendOtpValidation} from "../middlewares/validationMiddleware.js"
const router = Router();

router.post("/register",registerValidation,registerUser);
router.post("/login",loginValidation,loginUser);
router.post("/verify-email",verifyOtpValidation,verifyOtp);
router.get("/resend-otp",resendOtpValidation,resendOtp);
router.get("/logout",logoutUser);

export default router;