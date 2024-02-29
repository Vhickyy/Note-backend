import { verifyJWT } from "../utils/utils.js";

export const authenticated = async (req,res,next) => {
    console.log(req.cookies);
    const {token} = req.cookies;
    // console.log("here");
    // console.log(req.cookies);
    if(!token){
        console.log("auth error one");
        res.status(401);
        throw new Error("Unauthorized to access this route");
    }
    try {
        // console.log("here");
        const user = verifyJWT(token)
        req.user = user;
        // console.log(req.user);
        next()
    } catch (error) {
        console.log("auth error two");
        res.status(401);
        throw new Error("Unauthorized to access this route");
    }
} 