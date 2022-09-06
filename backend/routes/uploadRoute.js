const express = require('express');
const { uploadFile } = require('../controllers/uploadController');
const verifyUser = require('../middlewares/verifyUserMiddleware');

const uploadRouter = express.Router();

uploadRouter.post('/', verifyUser, uploadFile);

module.exports = uploadRouter;
