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
        let result = await Post.findOne({_id: post_id}).exec();

        if(!result) {
            res.status(401);
            throw new Error('user not authorized');
        }
        const comment_doc = new Comment({
            post: post_id,
            author: decoded._id,
            body
        })
        result = await Comment.create(comment_doc);
        if(!result) {
            throw new Error('comment cannot be saved');
        }
        result = await Post.findOneAndUpdate({_id:post_id},{$push: {comments: result._id}});
        if(!result) {
            throw new Error('comment cannot be saved');
        }
        result = await Post.findOne({id:post_id}).populate('comments');
        res.json({
            message: 'comment created',
            result: result.comments
        })
    } catch (error) {
        throw new Error(error);
    }
})

const newReply = asyncHandler(async (req, res) => {
    const { post_id, comment_id, body } = req.body;
    if(!post_id || !comment_id || !body) {
        res.status(400);
        throw new Error('some fields are empty');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
    try {
        let result = await Post.findById(post_id).exec();
        if(!result) {
            throw new Error('post not found');
        }
        result = await Comment.findById(comment_id).exec();
        if(!result) {
            throw new Error('parent comment not found');
        }
        let doc = new Comment({
            body,
            author:decoded._id,
            post:post_id
        });
        result = await Comment.save(doc);
        result = await Comment.findOneAndUpdate({_id:comment_id},{$push: {reply: result._id}});
        if(!result) {
            throw new Error('can\'t create new reply');
        }
    } catch (error) {
        throw new Error(error);
    }
})

const editComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req.body;
    if(!id || !body) {
        res.status(400);
        throw new Error('some fields are empty');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
    try {
        let result = await Comment.findOne({_id:id}).exec();
        if(!result || result.author !== decoded._id) {
            res.status(401);
            throw new Error('user not authorized');
        }
	    result = await Comment.findOneAndUpdate({_id:id},{$set: {body}});
        res.json({
            message: 'updated successfully',
            result
        });
    } catch (error) {
        throw new Error(error);
    }
})

const deleteComment = asyncHandler(async (req,res) => {
	const { id } = req.params;
	const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
	try {
		let doc = await Comment.findOne({_id:id}).exec();
		if(!doc || doc.author !== decoded._id) {
			res.status(401);
			throw new Error('user not authorized');
        }
		// delete subcomments signature from comments
		doc = await Comment.findOneAndUpdate({_id: doc.root_id}, {$pull: {reply: id}});
		// delete actual comment
		doc = await Comment.findOneAndDelete({_id:id}).exec();
		res.json({
			message: 'comment deleted',
			result: []
		});

	} catch (error) {
		throw new Error(error);
	}
})

const likeComment = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
	try {
		let doc = await Comment.findOne({_id:id});
		if(!doc) {
			res.status(404);
			throw new Error('comment not found');
		}
		// check if it is already liked
		doc = await Comment.findOne({_id:id}, {likes: {$eq: decoded._id}});
		if(doc) {
			doc = await Comment.finOneAndUpdate({_id:id}, {$pull: {likes: {$eq: decoded._id}}});
			res.json({
				message: 'like removed',
				result: []
			});
		} else {
			// first time liking
			doc = await Comment.findOneAndUpdate({_id:id}, {$push: {likes: decoded._id}});
			res.json({
				message: 'like added',
				result: []
			})
		}
    } catch (error) {
        throw new Error(error);
    }
})

const listComment = asyncHandler(async (req, res) => {
    const { pages, rows } = req.query;
	const { id } = req.params;
    if( !id || !pages || !rows ) {
    	res.status(400);
    	throw new Error('some fields are missing');
    }
	try {
        let doc = await Post.findOne({_id:id});
		if(doc.length === 0) {
                return res.json({
                    message: 'no items found',
                    result: []
                })
        } 
        let comments = [];
        for(let item of doc.comments) {
            let id = item.valueOf();
           comments.push(await Comment.findOne({_id:id}).populate('author'));
        }
        res.json({
            message: 'successfully retreived',
            result: comments
        })
        
    } catch (error) {
        throw new Error(error);
    }
})      

const listReply = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rows, pages } = req.query;
    if(!rows || !pages || !id) {
        res.status(400);
        throw new Error('some fields are missing');
    }
    try {
        let result = await Comment.findOne({_id:id}).populate('reply');
        if(result.length === 0) {
            res.json({
                message: 'no items found',
                result: []
            })
        } else {
            res.json({
                message: 'successfully retrieved',
                result
            })
        }
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = { newComment, newReply, editComment, deleteComment, listComment, likeComment, listReply};
