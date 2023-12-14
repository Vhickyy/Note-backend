const notFoundHandler = (req,res) => {
    return res.status(404).json({msg:"route does not exist"})
}

const errorHandler = (err,req,res,next) =>  {
    console.log(err);
    const status = res.statusCode || 500;
    const message = err.message || "Internal server error."
    return res.status(status).json({msg:message});
}

export {notFoundHandler,errorHandler}