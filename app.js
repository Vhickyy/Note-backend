import express from "express";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import passport from "passport";
import cookieSession from "cookie-session";
import cors from "cors";
import {googleSessionMiddleware} from "./services/passport.js"
import { errorHandler, notFoundHandler } from "./middlewares/notFound_Error.js";
import authRouter from "./routes/authRoute.js"; 
import noteRouter from "./routes/noteRoute.js";
import projectRouter from "./routes/projectRoute.js";
import userRouter from "./routes/userRoute.js";
import googleRouter from "./routes/googleRoute.js";
import { authenticated } from "./middlewares/authMiddleware.js";

const appConfig = (app) => {
   app.use(cookieparser(process.env.JWT_SECRET))
   const whitelist =  ["http://localhost:5173","https://veenotes.netlify.app"];
   const opt = {
      origin:  (origin,callback) => {
            console.log(origin,"djjsj");
            if(whitelist.indexOf(origin) !== -1 || !origin){
               console.log(origin,"lkkk");
               callback(null,true)
            }else{
               console.log("jijiu");
               callback(new Error("not allowed by cors"))
            }
         },
      methods: ["GET,POST,PUT,PATCH,DELETE"],
      optionsSuccess: 200,
      credentials:true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      preflightContinue: false
   }
   
  app.use(cors(opt))
      app.use(express.json())
    // morgan
    if(process.env.NODE_ENV === "development"){
        app.use(morgan("dev"))
    }   

    // google middleware
    
       app.use(cookieSession({
        name:"session",
        keys:["lama"],
        maxAge: 1000 * 60 * 60 * 24
        }))
       .use(googleSessionMiddleware)
       .use(passport.initialize())
       .use(passport.session());


   //     app.get("/noteapi",(req,res)=>{
   //       return res.status(200).json({msg:"hello world"}) 
   //   })
    // routes
    app.use("/api",authRouter)
       .use("/auth",googleRouter)
       .use("/api",authenticated,noteRouter)
       .use("/api",authenticated,userRouter)
       .use("/api",authenticated,projectRouter)
      //  .use("/api",projectRouter)
   
    // not-found and error route
    app.use("*",notFoundHandler)
       .use(errorHandler);
}

export default appConfig