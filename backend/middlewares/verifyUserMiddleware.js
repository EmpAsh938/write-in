const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const Auth = require('../models/authModel');

const verifyUser = asyncHandler(async (req, res, next) => {
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        res.status(401);
        throw new Error('Authorization header missing');
    }
    const token = req.headers.authorization.split('Bearer')[1].trim();
    try {
        let decoded = await jwt.verify(token,process.env.JWT_SECRET);
        let isUser = await Auth.findById(decoded._id).exec();
        if(!isUser) {
            res.status(401);
            throw new Error('User not Authorized');
        } else {
            next();
        }
    } catch (error) {
        res.status(401);
        throw new Error(error);
    }
})

module.exports = verifyUser;