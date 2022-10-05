const express = require('express');

const {
    listReply,
    newReply,
    editReply,
    likeReply,
    deleteReply
} = require('../controllers/replyController');

const replyRouter = express.Router();

replyRouter.post('/new', newReply);
replyRouter.get('/list/:id', listReply);
replyRouter.put('/edit/:id', editReply);
replyRouter.put('/like/:id', likeReply);
replyRouter.delete('delete/:id', deleteReply);

module.exports = replyRouter;