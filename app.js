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
   app.use(function (req, res, next) {
      console.log(req.headers.origin);
      res.header("Access-Control-Allow-Origin", "https://veenotes.netlify.app");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
      res.header("Access-Control-Expose-Headers", "Content-Length");
      res.header(
        "Access-Control-Allow-Headers",
        "Accept, Authorization, Content-Type, X-Requested-With, Range"
      );
      if (req.method === "OPTIONS") {
        return res.sendStatus(200);
      } else {
        return next();
      }
    });

  
   // (origin,callback) => {
   //    console.log(origin,"djjsj");
   //    if(whitelist.indexOf(origin) !== -1 || !origin){
   //       console.log(origin,"lkkk");
   //       callback(null,true)
   //    }else{
   //       console.log("jijiu");
   //       callback(new Error("not allowed by cors"))
   //    }
   // },
   // app.options("*", (req, res,next) => {
   //    console.log(req.headers.origin,"opui");
   //    res.setHeader("Access-Control-Allow-Origin", "https://veenotes.netlify.app");
   //    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
   //    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
   //    res.status(204);
   //    next()
   //  });
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
      methods: ["GET,POST,PUT,PATCH,DELETE,OPTIONS"],
      optionsSuccess: 200,
      credentials:true,
      // allowedHeaders: ['Content-Type', 'Authorization'],
      preflightContinue: false
   }
   const credentials = (req, res, next) => {
      const origin = req.headers.origin;
      // console.log(req.headers['access-control-allow-origin']);
      // const origin = req.headers["access-control-allow-origin"];
      console.log(origin, "hh");
      if (whitelist.includes(origin) || !origin) {
         console.log("kk");
         res.setHeader('Access-Control-Allow-Origin', "http://localhost:5173")
         //  res.header('Access-Control-Allow-Credentials', true);
          console.log("ll");
      }
      next();
  }
//   app.use(credentials)
//   app.use(cors(opt))
      app.use(express.json())
    // morgan
    if(process.env.NODE_ENV === "development"){
        app.use(morgan("dev"))
    }   

    // google middleware
    app.use(cookieparser())
       .use(cookieSession({
        name:"session",
        keys:["lama"],
        maxAge: 1000 * 60 * 60 * 24
        }))
       .use(googleSessionMiddleware)
       .use(passport.initialize())
       .use(passport.session());

    // routes
    app.use("/api",authRouter)
       .use("/auth",googleRouter)
       .use("/api",authenticated,noteRouter)
       .use("/api",authenticated,userRouter)
      //  .use("/api",authenticated,projectRouter)
       .use("/api",projectRouter)
   
    // not-found and error route
    app.use("*",notFoundHandler)
       .use(errorHandler);
}

export default appConfig