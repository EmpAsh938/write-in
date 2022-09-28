const path = require('path');
const multer = require('multer');
const express = require('express');

const { uploadFile, profileUpdate } = require('../controllers/uploadController');
const verifyUser = require('../middlewares/verifyUserMiddleware');

const uploadRouter = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
})

const fileFilter = (req, file, cb) => {
    const { mimetype } = file;
    if(mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('wrong mimetype'));
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024}
})

uploadRouter.post('/', verifyUser, upload.single('photos'), uploadFile);
uploadRouter.post('/profile', verifyUser, upload.single('photos'), profileUpdate);

module.exports = uploadRouter;
