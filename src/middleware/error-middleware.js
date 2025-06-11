const errorMiddleware = (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }
    res.status(500).json({
        errors: err.message
    })
}

export {
    errorMiddleware,
}