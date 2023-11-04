import "express-async-errors"
import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import appConfig from "./app.js";
import "./services/passport.js"

dotenv.config()
const app = express();

// app.use(cookieparser())




// test
app.get("/api",(req,res)=>{
    return res.status(200).json({msg:"hello world"})
})
app.post("/api/test-user",(req,res)=>{
    const user = req.body;
    console.log(user)
    return res.status(200).json({msg:"hello world"})
})

const port = process.env.PORT || 8000
app.listen(port, async ()=>{
    try {
        // await mongoose.connect(process.env.MONGO_URL);
        appConfig(app)
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})