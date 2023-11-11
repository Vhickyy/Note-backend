import {Router} from "express";
import passport from "passport";
const router = Router();
 
// google
router.get('/google',passport.authenticate('google', { scope: ['email','profile'] }));

router.get("/failed",(req,res)=>{
    res.status(401).json({msg:"failed to authorized using google"});
})

router.get("/success", (req,res) => {
    console.log(req.user);
    console.log("hi");
    return res.status(200).json({msg:"success"})
})

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:8000/auth/failed' ,
    successRedirect: "http://localhost:8000/auth/success"
    })
);



export default router;