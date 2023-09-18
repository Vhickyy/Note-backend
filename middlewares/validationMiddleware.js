import { body, validationResult } from "express-validator";

const validationLayer = (validations) => {
    return (
        validations,
        (req,res,next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                const errMsg = errors.array().map(err=> err.msg);
                throw new Error(errMsg)
            }
        }
    )
}