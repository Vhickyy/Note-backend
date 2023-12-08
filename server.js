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
app.get("/noteapi",(req,res)=>{
    return res.status(200).json({msg:"hello world"}) 
})
app.get("/api/test-user",(req,res)=>{
    // const user = req.body;
    // console.log(user)
    return res.status(200).json({msg:"hello world2"})
})
const port = process.env.PORT || 8000
app.listen(port, async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        appConfig(app)
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})

// const server = null;

// io.on("connection", (userId) => {
//     console.log(`${userId} connected`);
//     socket.on("join project", (projectId) => {
//         console.log(projectId);
//         socket.emit("joined",{msg:"welcome to the room"})
//         socket.broadcast.to(projectId).emit("joined",{msg:"user joined the room"})
//         socket.join(projectId);
//     })

//     socket.on("send invite", (users) => {
//         console.log(users);
//     })

//     socket.on("write",(message,projectId)=>{
//         io.to(projectId).emit("message",{message,user:userId})
//     })
    
//     socket.on("disconect", () => {
//         console.log("disconnected");
//     })
// });