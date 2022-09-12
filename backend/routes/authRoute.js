const express = require('express');

const verifyUser = require('../middlewares/verifyUserMiddleware');
const { loginUser, registerUser, validateUser, bookmarkPost } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);
authRouter.get('/bookmark/:id',verifyUser, bookmarkPost);
authRouter.get('/verify', verifyUser , validateUser);

module.exports = authRouter;