const notFoundHandler = (req,res) => {
    return res.status(404).json({msg:"route does not exist"})
}

const errorHanler = (err,req,res,next) =>  {
    const status = res.statusCode || 500;
    const message = err.message || "Internal server error."
    return res.status(status).json({msg:message});
}

export {notFoundHandler,errorHanler}