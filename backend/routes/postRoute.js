const express = require('express');

const verifyUser = require('../middlewares/verifyUserMiddleware');
const { 
    editBlog,
    likeBlog,
    deleteBlog,
    searchBlogs,
    getBlogSingle,
    createNewBlog,
    listBlogsPublic,
    listBlogsPrivate,
 } = require('../controllers/postController');

const postRouter = express.Router();

postRouter.get('/all' , listBlogsPublic);             // public all blogs
postRouter.get('/search', searchBlogs);                // search blogs
postRouter.post('/save', verifyUser, createNewBlog);            // private new blog
postRouter.get('/me', verifyUser, listBlogsPrivate);             // private all blogs
postRouter.delete('/me/:id', verifyUser, deleteBlog);          // private delete
postRouter.put('/edit/:id', verifyUser, editBlog);         // private edit
postRouter.get('/get/:id', getBlogSingle);         // public single blog
postRouter.get('/like/:id', verifyUser, likeBlog);             // like blog
postRouter.post('/comment/new', verifyUser, newComment);        // new comment
postRouter.post('/comment/reply', verifyUser, replyComment);        // reply comment
postRouter.put('/comment/edit/:id', verifyUser, editComment);        // edit comment
postRouter.delete('/comment/delete/:id', verifyUser, deleteComment);        // delete comment
postRouter.get('/comment/like/:id', verifyUser, likeComment);        // like comment

module.exports = postRouter;