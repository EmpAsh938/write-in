const fs = require('fs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const Auth = require('../models/authModel');
const cloudinary = require('../config/cloudinary');

const uploadFile = asyncHandler(async (req, res) => {
   if(!req.file) {
      res.status(400);
      throw new Error('no file uploaded');
   }
   try {
      
      const result = await cloudinary.uploader.upload(req.file.path, {
         folder: 'write-in/post',
         context: `alt=${req.file.originalname.split('.')[0]}`,
         public_id: req.file.filename
      })
      if(!result) {
         throw new Error('file upload failed');
      }
      await fs.unlink(req.file.path);
      res.json({
         message:'file uploaded',
         result
      })
   } catch (error) {
      throw new Error(error);
   }
})

const profileUpdate = asyncHandler(async (req, res) => {
   if(!req.file) {
      res.status(400);
      throw new Error('no file attached');
   }

   const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());

   try {
      let results = await cloudinary.uploader.upload(req.file.path, {
         folder: 'write-in/avatar',
         context: `alt=${req.file.originalname.split('.')[0]} logo`,
         public_id: req.file.filename
      })
      if(!results) {
         throw new Error('file upload failed');
      }
      await fs.unlink(req.file.path);

      if(decoded.profileImage) {
         let len = decoded.profileImage.split('/').length;
         await cloudinary.uploader.destroy(`write-in/avatar/${decoded.profileImage.split('/')[len-1].split('.')[0]}`);
      }
      let doc = await Auth.findOneAndUpdate({_id:decoded._id}, {$set: {profileImage: results.secure_url}});
      if(!doc) {
         throw new Error('profile upload failed');
      }
      doc = await Auth.findById(decoded._id).exec();
      let newtoken = await jwt.sign(doc.toJSON(),process.env.JWT_SECRET,{expiresIn:'1D'});
      res.json({
         message:'file uploaded',
         result: {
            ...doc,
            token: newtoken
         }
      })
   } catch (error) {
      throw new Error(error);
   }
})

module.exports = { uploadFile, profileUpdate };
