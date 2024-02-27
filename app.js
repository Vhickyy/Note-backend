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
      res.header("Access-Control-Allow-Origin", "*");
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
   app.use(cors(
      {
       origin: ["http://localhost:5173","https://veenotes.netlify.app"],
       methods: ["GET,POST,PUT,PATCH,DELETE"],
       credential:true,
       'Access-Control-Allow-Credentials': true
   }
   ))
      .use(express.json())
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