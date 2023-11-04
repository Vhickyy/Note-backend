import { body, validationResult, param } from "express-validator";
import mongoose from "mongoose";
const validationLayer = (validations) => {
    return ([
        validations,
        (req,res,next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                const errMsg = errors.array().map(err=> err.msg);
                res.status(401);
                throw new Error(errMsg[0])
            }
            next()
        }
    ])
}
// Auth validtion
export const registerValidation = validationLayer([
    body("name").notEmpty().withMessage("Please provide all fields"),
    body("email").notEmpty().withMessage("Please provide all fields").isEmail().withMessage("Please provide a valid email."),
    body("password").notEmpty().withMessage("Please provide all fields")
])
export const loginValidation = validationLayer([
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email."),
    body("password").notEmpty().withMessage("Password is required")
])
export const verifyOtpValidation = validationLayer([
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email."),
    body("otpCode").notEmpty().withMessage("Invalid code")
])
export const resendOtpValidation = validationLayer([
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid.")
])

// note validation
export const addNoteValidation = validationLayer([
    body("title").notEmpty().withMessage("Title is required"),
    body("noteBody").notEmpty().withMessage("noteBody is required")
])

export const paramValidation = validationLayer([
    param("id").custom(id =>{
        const validId = mongoose.Types.ObjectId.isValid(id);
        if(!validId){
            res.status(401);
            throw new Error(`Invalid id - ${id}`);
    }
    })
])