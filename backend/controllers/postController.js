const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const Auth = require('../models/authModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const Reply = require('../models/replyModel');

const searchBlogs = asyncHandler(async (req, res) => {
    const { term, pages, rows, sort } = req.query;
    if(!term || !pages || !rows) {
        res.status(400);
        throw new Error('term/pages/rows are missing.');
    }
    let re = new RegExp(term);
    try {
        let doc;
        if(!sort || sort !== 1 || sort !== -1) {
            doc = await Post.find({title: {$regex: re, $options: 'i'}}).populate('author').skip(rows * (pages-1)).limit(rows).exec();
        } else {
            let sortParam = sort;
            doc = await Post.find({ title: {$regex: re, $options: 'i'} }).populate('author').sort({createdAt: sortParam}).skip(rows * (pages-1)).limit(rows).exec();
        }
        if(doc.length === 0) {
            res.json({
                message: 'items not found',
                result: []
            })
        } else {
            res.json({
                message: 'successfully retrieved',
                result: doc
            })
        }
    } catch (error) {
        throw new Error(error);
    } 
})

const listBlogsPublic = asyncHandler(async (req, res) => {
    const { pages, rows } = req.query;
    if (!pages || !rows) {
        res.status(400);
        throw new Error('No valid query parameter found');
    }
    try {
        const doc = await Post.find({ status:{$eq:'published'} }).populate('author').sort({ createdAt: -1 }).skip(rows * (pages - 1)).limit(rows).exec();
        if (doc.length === 0) {
            return res.json({
                message: "items not found: either load more documents or lower the page limit",
                result: []
            })
        }
        res.json({
            message: "succesfully retreived",
            result: doc
        })
        
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
})

const createNewBlog = asyncHandler(async (req, res) => {
    const { title, markdown, status } = req.body;
    if (!title || !status) {
        res.status(400);
        throw new Error('title or status is empty');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());

    const newPost = new Post({
        title,
        markdown,
        status,
        author: decoded._id
    });
    try {
        await newPost.save();
        res.json({
            message: "successfully saved",
            result: []
        })
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
})

const editBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, markdown, status } = req.body;
    if (!id) {
        res.status(400);
        throw new Error('some parameters are missing');
    }
    try {
        const query = await Post.findByIdAndUpdate(id, {
            $set: {
                title,
                status,
                markdown
            }
        })
        if(!query) {
            res.status(401);
            throw new Error('Editing failed');
        } else {

            res.json({
                message: "successfully updated",
                result: []
            })
        }
    } catch (error) {
        res.status(401);
        throw new Error(error);
    }
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400);
        throw new Error('Id missing');
    }
    try {
        const doc = await Post.findByIdAndDelete(id);
        if(!doc) {
            res.status(404);
            throw new Error('Deletion failed');
        }
        // delete comments with reply
        if(doc.comments > 0){
            for(const item of doc.comments) {
                let comment_id = item.valueOf();
                let getReply = await Comment.findOneAndDelete({_id:comment_id});
                if(getReply && getReply.reply.length > 0){
                    for(const newItem of getReply.reply) {
                        let reply_id = newItem.valueOf();
                        await Reply.findOneAndDelete({_id:reply_id});
                    }
                }
            }
        }
        res.json({
            message: "successfully deleted",
            result: doc
        })
    } catch (error) {
        throw new Error(error);
    }
})

const listBlogsPrivate = asyncHandler(async (req, res) => {
    const { pages, rows } = req.query;
    const token = req.headers.authorization.split('Bearer')[1].trim();
    const decoded = jwt.decode(token);
    const id = decoded._id;
    if (!id) {
        res.status(401);
        throw new Error('Not Authorized');
    }
    if(!pages || !rows) {
        res.status(400);
        throw new Error('pages or rows are missing');
    }
    try {
        const docs = await Post.find({}).populate({
            path: 'author',
            match: {
                _id: { $eq: id }
            }
        }).sort({ createdAt: -1 }).skip(rows * (pages-1)).limit(rows).exec();
        if (docs.length === 0) {
            res.json({
                message: 'not enough items to show',
                result: []
            })
        } else {
            res.json({
                message: 'successfully retrieved',
                result: docs
            })
        }
    } catch (error) {
        res.status(401);
        throw new Error(error);
    }
})

const getBlogSingle = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400);
        throw new Error('id parameter is missing');
    }
    let get_views_id;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        let get_token = req.headers.authorization.split('Bearer')[1].trim();
        if(get_token) {
            let decoded = jwt.decode(get_token);
            get_views_id = decoded._id;
        }
    }
    try {
        // checking if post exits
        const doc = await Post.findById(id).populate('author').exec();
        if (!doc) {
            return res.json({
                message: 'not found',
                result: []
            })
        }
        if(get_views_id) {
            // find if that viewer exists
            let result = await Post.findOne({_id:id, views: {$eq: get_views_id}});
            // if not add him
            if(!result) {
                result = await Post.findByIdAndUpdate(id, {$push: {views: get_views_id}});
            }
        }
        res.json({
            message: 'successfully retrieved',
            result: doc
        })
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
})

const likeBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!id) {
        res.status(400);
        throw new Error('id missing');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
    const user_ref_id = decoded._id;
    try {
        let doc = await Post.findById(id).exec();
        if(!doc) {
            res.status(404);
            return res.json({
                message: 'not found',
                result: []
            })
        }
        doc = await Post.findOne({_id:id, likes: {$eq: user_ref_id}}).exec();
       
        if(doc) {
            doc = await Post.findOneAndUpdate({_id:id}, {$pull: {likes: {$eq: user_ref_id}}}).exec();
            doc = await Post.findOne({_id:id}).exec();
            return res.json({
                message: 'like removed',
                result: doc
            })
        }
        let results = await Post.findByIdAndUpdate(id,{$push: {"likes": user_ref_id}}).exec();
        if(!results) {
            return res.status(404).json({
                message: 'not found',
                result: []
            })
        }
        results = await Post.findOne({_id:id}).exec();
        res.json({
            message: 'liked',
            result: results
        })
    } catch (error) {
        throw new Error(error);
    }
})

const listUserBlogs = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { pages, rows, filter } = req.query;
    if(!id || !pages || !rows) {
        res.status(400);
        throw new Error('missing parameters');
    }
    try {
        let doc = await Auth.findOne({_id:id});
        if(!doc) {
            throw new Error('user not found');
        }
        if(filter === 'liked') {
            doc = await Post.find({author:id,status:'published'}).populate('author').sort({likes: -1}).skip(rows * (pages - 1)).limit(rows);
        } else if(filter === 'oldest') {
            doc = await Post.find({author:id,status:'published'}).populate('author').sort({createdAt: 1}).skip(rows * (pages - 1)).limit(rows);
        } else {
            doc = await Post.find({author:id,status:'published'}).populate('author').sort({createdAt: -1}).skip(rows * (pages - 1)).limit(rows);
        }
        res.json({
            message: 'user blogs',
            result: doc
        })
    } catch (error) {
       throw new Error(error); 
    }
})



module.exports = {
    likeBlog,
    editBlog,
    deleteBlog,
    searchBlogs,
    createNewBlog,
    getBlogSingle,
    listBlogsPublic,
    listBlogsPrivate,
    listUserBlogs
}
