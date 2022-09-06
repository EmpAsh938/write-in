const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyUser = asyncHandler(async (req, res, next) => {
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        res.status(401);
        throw new Error('Authorization header missing');
    }
    const token = req.headers.authorization.split('Bearer')[1].trim();
    try {
        await jwt.verify(token,process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401);
        throw new Error(error);
    }
})

module.exports = verifyUser;