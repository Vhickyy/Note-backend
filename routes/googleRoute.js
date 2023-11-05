import {Router} from "express";

const router = Router();
 
// google
router.get('/auth/google',passport.authenticate('google', { scope: ['profile'] }));

router.get("/failed",(req,res)=>{
    res.status(401).json({msg:"failed to authorized using google"});
})

router.get("/success", (req,res) => {
    console.log(req.user);
})

router.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/failed' ,
    successRedirect: "/success"
    }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
// }
);



export default router;