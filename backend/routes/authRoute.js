const express = require('express');

const verifyUser = require('../middlewares/verifyUserMiddleware');
const { loginUser, registerUser, validateUser, bookmarkPost, listBookmark } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);
authRouter.get('/bookmark/list', verifyUser, listBookmark);
authRouter.get('/bookmark/:id',verifyUser, bookmarkPost);
authRouter.get('/verify', verifyUser , validateUser);

module.exports = authRouter;