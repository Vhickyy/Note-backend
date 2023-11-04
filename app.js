import express from "express";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import passport from "passport";
import cookieSession from "cookie-session";

import { errorHandler, notFoundHandler } from "./middlewares/notFound_Error.js";
import authRouter from "./routes/authRoute.js";
import noteRouter from "./routes/noteRoute.js";

const appConfig = (app) => {
    app.use(express.json())
    // app.use(cors({
    //     origin: "http://localhost:3000",
    //     methods: "GET,POST,PUT,PATCH,DELETE",
    //     credential:true 
    // }))

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
       .use(passport.initialize())
       .use(passport.session());

    // routes
    app.use("/noteapi",authRouter)
       .use("/noteapi",noteRouter)
    
    // not-found and error route
    app.use("*",notFoundHandler)
       .use(errorHandler);
}

export default appConfig