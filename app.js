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
   // app.use(function (req, res, next) {
   //    // ,"https://veenotes.netlify.app"]
   //    console.log(req.headers.origin);
   //    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
   //    res.header("Access-Control-Allow-Credentials", "true");
   //    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
   //    res.header("Access-Control-Expose-Headers", "Content-Length");
   //    res.header(
   //      "Access-Control-Allow-Headers",
   //      "Accept, Authorization, Content-Type, X-Requested-With, Range"
   //    );
   //    if (req.method === "OPTIONS") {
   //      return res.sendStatus(200);
   //    } else {
   //      return next();
   //    }
   //  });
   //    {
   //     origin: "http://localhost:5173",
   //     methods: ["GET,POST,PUT,PATCH,DELETE"],
   //     credential:true,
   //    //  'Access-Control-Allow-Credentials': true
   // }
   // app.options('/api/user', (req, res) => {
   //    console.log("hherre");
   //    res.header('Access-Control-Allow-Methods', 'POST');
   //    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Include any other headers your POST request might use
   //    res.sendStatus(200);
   //  });
   const whitelist =  ["http://localhost:5173","https://veenotes.netlify.app"];
   const opt = {
      origin: (origin,callback) => {
         console.log(origin,"djjsj");
         if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null,true)
            console.log("lkkk");
         }else{
            console.log("jijiu");
            callback(new Error("not allowed by cors"))
         }
      },
      optionsSuccess: 200,
      credential:true
   }

//    const credentials = (req, res, next) => {
//       const origin = req.headers.origin;
//       console.log(origin, "hh");
//       if (whitelist.includes(origin)) {
//          // console.log("kk");
//          res.header("Access-Control-Allow-Origin", "http://localhost:5173")
//           res.header('Access-Control-Allow-Credentials', true);
//           console.log("ll");
//       }
//       next();
//   }
//   app.use(credentials)
  
   app.use(cors())
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
       .use("/api",authenticated,projectRouter)
   
    // not-found and error route
    app.use("*",notFoundHandler)
       .use(errorHandler);
}

export default appConfig