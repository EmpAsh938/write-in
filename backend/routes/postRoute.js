const express = require('express');

const verifyUser = require('../middlewares/verifyUserMiddleware');
const { listBlogsPublic, createNewBlog, getBlogSingle, listBlogsPrivate, editBlog, deleteBlog } = require('../controllers/postController');

const postRouter = express.Router();

postRouter.get('/all' , listBlogsPublic);             // public all blogs
postRouter.post('/save', verifyUser, createNewBlog);            // private new blog
postRouter.get('/me', verifyUser, listBlogsPrivate);             // private all blogs
postRouter.delete('/me/:id', verifyUser, deleteBlog);          // private delete
postRouter.put('/edit/:id', verifyUser, editBlog);         // private edit
postRouter.get('/get/:id', getBlogSingle);         // public single blog

module.exports = postRouter;