import { body, validationResult } from "express-validator";

const validationLayer = (validations) => {
    return (
        validations,
        (req,res,next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                const errMsg = errors.array().map(err=> err.msg);
                throw new Error(errMsg[0])
            }
        }
    )
}
// Auth validtion
export const registerValidation = validationLayer([
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email."),
    body("password").notEmpty().withMessage("Password is required")
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