const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const Auth = require('../models/authModel');

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error('Some fields are empty');
    }

    try {
        const user = await Auth.findOne({email});
        if(!user || !(await bcrypt.compare(password,user.password))) {
            res.status(401);
            throw new Error('user not authorized');
        }
        const token = await jwt.sign(user.toJSON(),process.env.JWT_SECRET, { expiresIn: "1D" });

        res.status(200).json({
            message: 'login user',
            result: {
                ...user,
                token
            }
        })
    } catch (error) {
        res.status(401);
        throw new Error(error);
    }
})


const registerUser = asyncHandler(async (req, res) => {
    const { email, fullname, username, password } = req.body;
    if(!email || !password || !fullname || !username) {
        res.status(400);
        throw new Error('Some fields are empty');
    }

    const isValidPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);
    if(!isValidPassword) {
        res.status(400);
        throw new Error('Password too weak');
    } 

    const hashedPassword = await bcrypt.hash(password,10);

    const emailExists = await Auth.findOne({email})
    const userExists = await Auth.findOne({username});

    if(emailExists || userExists) {
        res.status(400);
        throw new Error('User already Exists');
    }

   

    const user = new Auth({
        email,
        fullname,
        username,
        password:hashedPassword,
        profileImage:''
    });

    try {
        const doc = await user.save()
        const token = await jwt.sign(doc.toJSON(),process.env.JWT_SECRET, { expiresIn: "1000" });
        res.status(200).json({
            message: 'register user',
            result: {
                ...doc,
                token
            }
        })
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
})

const logoutUser = (req, res) => {
    res.status(200).json({
        message: 'logout user'
    })
}

const validateUser = asyncHandler(async (req, res) => {
    const userToken = req.headers.authorization.split('Bearer')[1].trim();
    const decoded = jwt.decode(userToken);
    if(!decoded) {
        res.status(401);
        throw new Error('user not authorized');
    }
    const { _id, email, password } = decoded;
    try {
        const result = await Auth.findOne({ _id, email, password }).exec();
        if(!result) {
            res.status(401);
            throw new Error('user not authorized');
        } else {
            const token = await jwt.sign(result.toJSON(),process.env.JWT_SECRET,{expiresIn:'1D'});
            res.json({
                message: 'verified',
                result: {
                    ...result,
                    token
                }
            })
        }
    } catch (error) {
        res.status(401);
        throw new Error(error);
    }
})

module.exports = { loginUser, registerUser, logoutUser, validateUser };