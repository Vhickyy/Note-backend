import { verifyJWT } from "../utils/utils.js";

export const authenticated = async (req,res,next) => {
    const {token} = req.cookies;
    console.log(token);
    if(!token){
        res.status(401);
        throw new Error("Unauthorized to access this route");
    }
    try {
        const user = verifyJWT(token);
        req.user = user;
        console.log(req.user);
        next()
    } catch (error) {
        res.status(401);
        throw new Error("Unauthorized to access this route");
    }
}