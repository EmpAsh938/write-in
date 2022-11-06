const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const Auth = require('../models/authModel');
const Post = require('../models/postModel');
const Reply = require('../models/replyModel');
const Comment = require('../models/commentModel');
const cloudinary = require('../config/cloudinary');
const { validPassword } = require('../utils/validPassword');
const { validEmail } = require('../utils/validEmail');
const { validUsername } = require('../utils/validUsername');
const { tokenGenerate } = require('../utils/tokenGenerate');

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
        const token = await tokenGenerate(user.toJSON());

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
        profileImage:'',
        bio: '',
        country: '',
        website: '',
        role: 'default'
    });

    try {
        const doc = await user.save()
        const token = await tokenGenerate(doc.toJSON());
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
            doc = await Auth.findOne({_id:decoded._id});
            let token = await tokenGenerate(doc.toJSON());
            return res.json({
                message: 'bookmark removed',
                result: {
                    token,
                    ...doc
                } 
            })
        }
        doc = await Auth.findByIdAndUpdate(decoded._id, {$push: {'bookmarks': id}}).exec();
        if(!doc) {
            res.status(400);
            throw new Error('not found');
        }
        doc = await Auth.findOne({_id:decoded._id});
        token = await tokenGenerate(doc.toJSON());
        res.json({
            message: 'bookmarked',
            result:{
                token,
                ...doc
            } 
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
        }
        let token = await tokenGenerate(result.toJSON());
        res.json({
            message: 'verified',
            result: {
                ...result,
                token
            }
        })
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
        const doc = await Auth.findOne({_id:user_id});
        let filtered_doc = doc.bookmarks.splice((rows*(pages-1)),rows);
        if(filtered_doc.length === 0) {
            res.status(404);
            throw new Error('No bookmarks found');
        }
        let bookmarks = [];
        for(const item of filtered_doc) {
            let singlepost = await Post.findOne({_id:item.valueOf()}).populate('author');
            if(singlepost !== null) {
                bookmarks.push(singlepost);
            }
        }
        if(bookmarks.length === 0) {
            res.status(404);
            throw new Error('No bookmarks found');
        }
        return res.json({
            message: 'bookmarks list',
            result: bookmarks
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
        let result = await Auth.findOne({_id:user._id});
        let token = await tokenGenerate(result.toJSON());
        res.status(200).json({
            message: 'password changed',
            result: {
                ...updatePass,
                token
            }
        })

    } catch (error) {
        throw new Error(error);
    }
})

const emailChange = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if(!email) {
        res.status(400);
        throw new Error('some fields are empty');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
    if(!validEmail(decoded.email)) {
        res.status(400);
        throw new Error('email format not valid');
    }
    try {
        let doc = await Auth.findOne({_id:decoded._id});
        
        if(email === decoded.email) {
            res.status(400);
            throw new Error('same email as old one');
        }
        doc = await Auth.findOneAndUpdate({_id:decoded._id},{$set: {email}});
        if(!doc) {
            throw new Error('email change failed');
        }
        doc = await Auth.findOne({_id:decoded._id});
        let token = await tokenGenerate(doc.toJSON());
        res.status(200).json({
            message: 'email changed',
            result: {
                ...doc,
                token
            }
        })
    } catch (error) {
        throw new Error(error);
    }

})

const accountInfoChange = asyncHandler(async (req, res) => {
    const { fullname, username, bio } = req.body;
    if(!fullname && !username && !bio) {
        res.status(400);
        throw new Error('some fields are empty');
    }
    const decoded = jwt.decode(req.headers.authorization.split("Bearer")[1].trim());
    if(!validUsername(decoded.username)) {
        res.status(400);
        throw new Error('username format not valid');
    }
    let insert_fullname = fullname || decoded.fullname;
    let insert_username = username || decoded.username;
    let insert_bio = bio || decoded.bio;
    try {
        let doc = await Auth.findOneAndUpdate({_id:decoded._id},{$set: {fullname:insert_fullname,username:insert_username,bio:insert_bio}});
        if(!doc) {
            throw new Error('update failed');
        }
        doc = await Auth.findOne({_id:decoded._id});
        let token = await tokenGenerate(doc.toJSON());
        res.json({
            message:'update success',
            result: {
                ...doc,
                token
            }
        })
    } catch (error) {
        throw new Error(error);
    }
})

const basicInfo = asyncHandler(async (req, res) => {
    const { bio, country, website } = req.body;
    if(!bio && !country && !website) {
        res.status(400);
        throw new Error('missing parameters');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
    try {
       let doc = await Auth.findOneAndUpdate({_id:decoded._id},{$set: {bio,country,website}}); 
        doc = await Auth.findOne({_id:decoded._id});
        let token = await tokenGenerate(doc.toJSON());
        res.json({
            message: 'basic info updated',
            result: {
                ...doc,
                token
            }
        })
    } catch (error) {
       throw new Error(error); 
    }
})

const deleteAccount = asyncHandler(async (req, res) => {
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
    try {
        // delete user
        let doc = await Auth.findOneAndDelete({_id:decoded._id});
        if(!doc) {
            res.status(401);
            throw new Error('user not authorized');
        }
        doc = await Post.find({author:decoded._id});
        if(doc.length > 0) {
            for(const post of doc){
                // delete post
                let singlePost = await Post.findOneAndDelete({_id:post._id});
                // delete images
                for(const item of singlePost.images) {
                    let firstsplit = item.split('/');
                    let secondsplit = item.split('/')[firstsplit.length-1];
                    let contextid = secondsplit.split('.')[0];
                    await cloudinary.uploader.destroy(`write-in/post/${contextid}`);
                }
                let newdoc = await Comment.find({post:post._id.valueOf()});
                if(newdoc.length > 0) {
                    for(const comment of newdoc){
                        // delete comments
                        await Comment.findOneAndDelete({_id:comment._id.valueOf()});
                        // delete replies
                        await Reply.deleteMany({comment:comment._id.valueOf()});
                    }
                }
            }
        }
        // delete profile image
      if(decoded.profileImage) {
         let len = decoded.profileImage.split('/').length;
         await cloudinary.uploader.destroy(`write-in/avatar/${decoded.profileImage.split('/')[len-1].split('.')[0]}`);
      }
        res.json({
            success: 'account deleted',
            result: []
        })
    } catch (error) {
        throw new Error(error);
    }
})

const followUser = asyncHandler(async (req, res) => {
    const { follow_id } = req.query;
    if(!follow_id) {
        res.status(400);
        throw new Error('follow_id required');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
    if(follow_id === decoded._id) {
        res.status(400);
        throw new Error('cannot follow yourself');
    }
    try {
        let doc = await Auth.findOne({_id:follow_id});
        if(!doc) {
            res.status(400);
            throw new Error('user not found');
        }
        // check if he is already being followed
        doc = await Auth.findOne({_id:follow_id, followers: {$eq: decoded._id}});
        if(doc) {
            // remove him
            doc = await Auth.findOneAndUpdate({_id:follow_id}, {$pull: {followers: {$eq: decoded._id}}});
            doc = await Auth.findOne({_id:follow_id});
            return res.json({
                message:'unfollow success',
                result: doc 
            })
        }
        // add him
        doc = await Auth.findOneAndUpdate({_id:follow_id}, {$push: {followers: decoded._id}});
        doc = await Auth.findOne({_id:follow_id});
        res.json({
            message:'follow success',
            result: doc 
        })
    } catch (error) {
        throw new Error(error);
    }

})

const getUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!id) {
        res.status(400);
        throw new Error('id missing');
    }
    try {
        let doc = await Auth.findOne({_id:id});
        if(!doc) {
            throw new Error('user not found');
        }
        return res.json({
            message: 'user info retrieved',
            result: doc
        })
    } catch (error) {
       throw new Error(error); 
    }
})

module.exports = { 
    loginUser, 
    followUser,
    emailChange, 
    validateUser,
    registerUser, 
    bookmarkPost, 
    listBookmark, 
    deleteAccount, 
    passwordChange, 
    accountInfoChange,
    getUserProfile,
    basicInfo
};
