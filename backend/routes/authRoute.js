const express = require('express');

const verifyUser = require('../middlewares/verifyUserMiddleware');
const { 
    loginUser, 
    registerUser, 
    validateUser, 
    bookmarkPost, 
    emailChange, 
    passwordChange, 
    listBookmark,
    deleteAccount,
    accountInfoChange, 
} = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);
authRouter.get('/bookmark/list', verifyUser, listBookmark);
authRouter.get('/bookmark/:id',verifyUser, bookmarkPost);
authRouter.get('/verify', verifyUser , validateUser);
authRouter.put('/change/email', verifyUser, emailChange);
authRouter.put('/change/password', verifyUser, passwordChange);
authRouter.put('/change/account', verifyUser, accountInfoChange);
authRouter.delete('/change/account', verifyUser, deleteAccount);

module.exports = authRouter;