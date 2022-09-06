
const errorHandler = (err, request, response, next) => {
    let statusCode = response.statusCode || 500;
    response.status(statusCode);
    return response.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
    next();
}

module.exports = errorHandler;