import {Router} from "express";
import {registerUser,loginUser,verifyOtp,resendOtp} from "../controllers/authController.js";
import {registerValidation, loginValidation, verifyOtpValidation, resendOtpValidation} from "../middlewares/validationMiddleware.js"
const router = Router();

router.post("/register",registerValidation,registerUser);
router.post("/login",loginValidation,loginUser);
router.post("/verify-email",verifyOtpValidation,verifyOtp);
router.get("/resend-otp",resendOtpValidation,resendOtp);

// google
router.get('/auth/google',passport.authenticate('google', { scope: ['profile'] }));

router.get("/login/failed",(req,res)=>{
    res.status(401).json({msg:"failed to authorized using google"});
})
router.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login/failed' ,
    successRedirect: "/"
    }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
// }
);

export default router;