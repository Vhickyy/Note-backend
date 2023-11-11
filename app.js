import express from "express";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import passport from "passport";
import cookieSession from "cookie-session";
import cors from "cors";
import googleSessionMiddleware from "./services/passport.js"
import { errorHandler, notFoundHandler } from "./middlewares/notFound_Error.js";
import authRouter from "./routes/authRoute.js";
import noteRouter from "./routes/noteRoute.js";
import googleRouter from "./routes/googleRoute.js";

const appConfig = (app) => {
   app.use(cors(
      {
       origin: "http://localhost:5173",
       methods: "GET,POST,PUT,PATCH,DELETE",
       credential:true 
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
       .use("/api",noteRouter)
       .use("/auth",googleRouter)
    
    // not-found and error route
    app.use("*",notFoundHandler)
       .use(errorHandler);
}

export default appConfig