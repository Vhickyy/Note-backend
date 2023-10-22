import "express-async-errors"
import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middlewares/notFound_Error.js";
import authRouter from "./routes/authRoute.js";
import noteRouter from "./routes/noteRoute.js";
dotenv.config()
const app = express();
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}
app.use(express.json());
app.use("/noteapi",authRouter)
app.use("/noteapi",noteRouter)
// test
app.get("/",(req,res)=>{
    return res.status(200).json({msg:"hello"})
})

app.use("*",notFoundHandler);
app.use(errorHandler);
const port = process.env.PORT || 8000
app.listen(port, async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})