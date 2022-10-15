const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const Reply = require('../models/replyModel');

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
        let doc = new Reply({
            body,
            author:decoded._id,
            comment:comment_id
        });
        result = await Reply.create(doc);
        doc = result;
        result = await Comment.findOneAndUpdate({_id:comment_id},{$push: {reply: result._id}});
        if(!result) {
            throw new Error('can\'t create new reply');
        } 
        result = await Reply.find({comment:comment_id}).populate('author');
        res.json({
            message: 'successfully created',
            result
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
        let doc = await Comment.findOne({_id:id});
		if(!doc || doc.reply.length === 0) {
            return res.json({
                message: 'no items found',
                result: []
            })
        } 
        let replies = [];
        for(let item of doc.reply) {
            let reply_id = item.valueOf();
           replies.push(await Reply.findOne({_id:reply_id}).populate('author'));
        }
        return res.json({
            message: 'successfully retreived',
            result: replies
        })
    } catch (error) {
        throw new Error(error);
    }
})
const editReply = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req.body;
    if(!id || !body) {
        res.status(400);
        throw new Error('some fields are empty');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
    try {
        let result = await Reply.findOne({_id:id}).exec();
        if(!result || result.author.valueOf() !== decoded._id) {
            res.status(401);
            throw new Error('user not authorized');
        }
	    result = await Reply.findOneAndUpdate({_id:id},{$set: {body}});
	    result = await Reply.findOne({_id:id}).populate('author');
        res.json({
            message: 'updated successfully',
            result
        });
    } catch (error) {
        throw new Error(error);
    }
})
const deleteReply = asyncHandler(async (req, res) => {
    const { id } = req.params;
	const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
	try {
		let doc = await Reply.findOne({_id:id}).exec();
		if(!doc || doc.author.valueOf() !== decoded._id) {
			res.status(401);
			throw new Error('user not authorized');
        }

        // delete from comment
        await Comment.findOneAndUpdate({_id:doc.comment.valueOf()}, {$pull: {reply: {$eq: id}}});

		// delete actual comment
		doc = await Reply.findOneAndDelete({_id:id}).exec();
		res.json({
			message: 'comment deleted',
			result: doc
		});

	} catch (error) {
		throw new Error(error);
	}
})
const likeReply = asyncHandler(async (req, res) => {
    const { id } = req.params;
	const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
	try {
		let doc = await Reply.findOne({_id:id});
		if(!doc) {
			res.status(404);
			throw new Error('comment not found');
		}
		// check if it is already liked
		doc = await Reply.findOne({_id:id, likes: {$eq: decoded._id}});
		if(doc) {
			doc = await Reply.findOneAndUpdate({_id:id}, {$pull: {likes: {$eq: decoded._id}}});
            doc = await Reply.findOne({_id:id});
			return res.json({
                message: 'like removed',
				result: doc
			});
		}
		// first time liking
		doc = await Reply.findOneAndUpdate({_id:id}, {$push: {likes: decoded._id}});
        doc = await Reply.findOne({_id:id});
		res.json({
			message: 'like added',
			result: doc
		})
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = { newReply, listReply, editReply, deleteReply, likeReply }
