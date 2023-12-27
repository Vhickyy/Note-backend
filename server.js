import "express-async-errors"
import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import appConfig from "./app.js";
import "./services/passport.js"
import {Server} from "socket.io"
import Project from "./models/projectModel.js";

// const socketio = io(8000)

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
const server = app.listen(port, async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        appConfig(app)
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})
const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods: "GET,POST,PUT,PATCH,DELETE",
    }
})

io.on("connection", socket => {
    console.log(`${socket.id} connected`);
    socket.on("join project", async (projectId) => {
        console.log(projectId);
        const validId = mongoose.Types.ObjectId.isValid(projectId);
        if(!validId){
            return
        }
        const project = await Project.findById({_id:projectId})
        if(!project){
            return
        }
        console.log(project);
        socket.join(projectId);
        // socket.emit("send project", project.projectBody)
        socket.on("writing", async (data) => {
            console.log(data);
            socket.broadcast.to(projectId).emit("send changes", data);
            // await Project.findByIdAndUpdate({_id: project._id}, {data})
        });
    })


    socket.on("disconnection", () => {
        console.log("disconnected 3");
    })
});



  //     socket.emit("joined",{msg:"welcome to the room"})
    //     socket.broadcast.to(projectId).emit("joined",{msg:"user joined the room"})
    //     socket.join(projectId);
//     socket.on("send invite", (users) => {
//         console.log(users);
//     })

//     socket.on("write",(message,projectId)=>{
//         io.to(projectId).emit("message",{message,user:userId})
//     })
    