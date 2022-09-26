const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const newComment = asyncHandler(async (req, res) => {
    const { post_id, body } = req.body;
    if(!post_id || !body) {
        res.status(400);
        throw new Error('some fields are emptpy');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());

    try {
        const result = await Post.findOne({_id: post_id}).exec();
        if(!result) {
            res.status(401);
            throw new Error('user not authorized');
        }
        const comment_doc = new Comment({
            post: post_id,
            author: decoded._id,
            body,
        })
        
    } catch (error) {
        throw new Error(error);
    }
})

export { newComment };




