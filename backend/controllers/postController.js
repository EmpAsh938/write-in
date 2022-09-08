const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const Post = require('../models/postModel');

const listBlogsPublic = asyncHandler(async (req, res) => {
    const { pages, rows } = req.query;
    if (!pages || !rows) {
        res.status(400);
        throw new Error('No valid query parameter found');
    }
    try {
        const doc = await Post.find({}).populate('author').sort({ createdAt: -1 }).skip(rows * (pages - 1)).limit(rows).exec();
        if (doc.length === 0) {
            res.json({
                message: "items not found: either load more documents or lower the page limit",
                result: []
            })
        } else {

            res.json({
                message: "succesfully retreived",
                result: doc
            })
        }
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
        const result = await Post.findByIdAndDelete(id);
        if(!result) {
            res.status(401);
            throw new Error('Deletion failed');
        } else {
            res.json({
                message: "successfully deleted",
                result: []
            })
        }
    } catch (error) {
        res.status(401);
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
        }).sort({ createdAt: -1 }).skip(rows * (pages-1)).limit(pages).exec();
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

    try {
        const doc = await Post.findById(id).populate('author').exec();
        if (!doc) {
            res.json({
                message: 'not found',
                result: []
            })
        }
        else {

            res.json({
                message: 'successfully retrieved',
                result: doc
            })
        }
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
})



module.exports = {
    editBlog,
    deleteBlog,
    createNewBlog,
    getBlogSingle,
    listBlogsPublic,
    listBlogsPrivate,
}