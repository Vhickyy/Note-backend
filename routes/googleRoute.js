import {Router} from "express";
import passport from "passport";
import {createJWT} from "../utils/utils.js"
const router = Router();
 
// google auth
router.get('/google',passport.authenticate('google', { scope: ['email','profile'] }));

router.get("/failed",(req,res)=>{
    res.status(401).json({msg:"failed to authorized using google"});
})

router.get("/success", (req,res) => {
    console.log(req.user);
    const token = createJWT({userId: req.user._id,userRole: req.user.role})
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
        secure: process.env.NODE_ENV === "production"
    })
    return res.redirect("http://localhost:5173/dashboard")
})

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:8000/auth/failed' ,
    successRedirect: "http://localhost:8000/auth/success"
    })
);


export default router;