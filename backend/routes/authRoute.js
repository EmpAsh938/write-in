const express = require('express');

const verifyUser = require('../middlewares/verifyUserMiddleware');
const { loginUser, registerUser, logoutUser, validateUser } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);
authRouter.get('/logout', logoutUser);
authRouter.get('/verify', verifyUser , validateUser);

module.exports = authRouter;