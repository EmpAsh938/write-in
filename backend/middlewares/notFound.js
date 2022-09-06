const notFound = (req, res, next) => {
    res.status(404).json({
        message: "page not found"
    })
    next();
}

module.exports = notFound;