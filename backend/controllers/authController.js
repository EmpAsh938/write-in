const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const Auth = require('../models/authModel');
const { validPassword } = require('../utils/validPassword');

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

    
    if(!validPassword(password)) {
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
        const token = await jwt.sign(doc.toJSON(),process.env.JWT_SECRET, { expiresIn: "1D" });
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

const bookmarkPost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!id) {
        res.status(400);
        throw new Error('id missing');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
    try {
        let doc = await Auth.findOne({_id:decoded._id, bookmarks: {$eq: id}}).exec();
        if(doc) {
            doc = await Auth.findOneAndUpdate({_id:decoded._id}, {$pull: {bookmarks: {$eq: id}}}).exec();
            doc = await Auth.findOne({_id:decoded._id}).exec();
            return res.json({
                message: 'bookmark removed',
                result: doc
            })
        }
        doc = await Auth.findByIdAndUpdate(decoded._id, {$push: {'bookmarks': id}}).exec();
        if(!doc) {
            res.status(400);
            throw new Error('not found');
        }
        doc = await Auth.findOne({_id:decoded._id}).exec();
        res.json({
            message: 'bookmarked',
            result: doc
        })
    } catch (error) {
        throw new Error(error);
    }
})

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

const listBookmark = asyncHandler(async (req, res) => {
    const { pages, rows } = req.query;
    if(!pages || !rows) {
        res.status(400);
        throw new Error('pages or rows are missing');
    }
    if(pages < 1 || rows < 1) {
        res.status(400);
        throw new Error('pages or rows can\'t be negative');
    }
    const user_id = jwt.decode(req.headers.authorization.split('Bearer')[1].trim())._id;
    try {
        const doc = await Auth.findOne({_id:user_id}).populate('bookmarks').exec();
        let filtered_doc = doc.bookmarks.splice((rows*(pages-1)),rows);
        if(filtered_doc.length === 0) {
            return res.status(404).json({
                message: 'no bookmarks to display',
                result: []
            })
        }
        return res.json({
            message: 'bookmarks list',
            result: filtered_doc
        })
    } catch (error) {
        throw new Error(error);
    }
})

const passwordChange = asyncHandler(async (req, res) => {
    const { oldpassword: oldPassword, newpassword: newPassword } = req.body;
    if(!oldPassword || !newPassword) {
        res.status(400);
        throw new Error('old or new password can\'t be empty');
    }
    const user = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
    try {
        const isUser = await Auth.findOne({_id:user._id}).exec();
        if(!isUser || !(await bcrypt.compare(oldPassword,isUser.password))) {
            res.status(401);
            throw new Error('user not authorized');
        }
        if(oldPassword === newPassword) {
            res.status(400);
            throw new Error('new and old passwords are same');
        }
        if(!validPassword(newPassword)) {
            res.status(400);
            throw new Error('Too weak password');
        }
        let hashedPassword = await bcrypt.hash(newPassword,10);
        let updatePass = await Auth.findOneAndUpdate({_id:user._id}, {$set: {password: hashedPassword}}).exec();
        if(!updatePass) {
            throw new Error('update failed');
        }
        let newtoken = await jwt.sign(updatePass.toJSON(),process.env.JWT_SECRET,{expiresIn:'1D'});
        res.status(200).json({
            message: 'password changed',
            result: {
                ...updatePass,
                token: newtoken
            }
        })

    } catch (error) {
        throw new Error(error);
    }
})

const emailChange = asyncHandler(async (req, res) => {

})

const accountInfoChange = asyncHandler(async (req, res) => {
    
})

const deleteAccount = asyncHandler(async (req, res) => {

})

module.exports = { loginUser, registerUser, bookmarkPost, listBookmark, emailChange, passwordChange, validateUser };