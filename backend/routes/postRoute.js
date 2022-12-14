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
    listUserBlogs,
    userBlogAnalytics
 } = require('../controllers/postController');


const postRouter = express.Router();

postRouter.get('/all' , listBlogsPublic);             // public all blogs
postRouter.get('/search', searchBlogs);                // search blogs
postRouter.get('/count', verifyUser, userBlogAnalytics);
postRouter.post('/save', verifyUser, createNewBlog);            // private new blog
postRouter.get('/me', verifyUser, listBlogsPrivate);             // private all blogs
postRouter.delete('/me/:id', verifyUser, deleteBlog);          // private delete
postRouter.put('/edit/:id', verifyUser, editBlog);         // private edit
postRouter.get('/get/:id', getBlogSingle);         // public single blog
postRouter.get('/like/:id', verifyUser, likeBlog);             // like blog
postRouter.get('/user/:id', listUserBlogs); 
module.exports = postRouter;
