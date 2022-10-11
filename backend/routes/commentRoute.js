const express = require('express');

const {
    listComment,
    newComment,
    editComment,
    likeComment,
    deleteComment
} = require('../controllers/commentController');

const commentRouter = express.Router();

commentRouter.post('/new', newComment);
commentRouter.get('/list/:id', listComment);
commentRouter.put('/edit/:id', editComment);
commentRouter.put('/like/:id', likeComment);
commentRouter.delete('/delete/:id', deleteComment);

module.exports = commentRouter;