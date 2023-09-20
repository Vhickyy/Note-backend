import {Router} from "express";
import {registerUser,loginUser,verifyOtp,resendOtp} from "../controllers/authController.js"
const router = Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/verify-email",verifyOtp);
router.get("/resend-otp",resendOtp);
export default router;