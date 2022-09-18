const fs = require('fs');
const cloudinary = require('../config/cloudinary');

const uploadFile = (async (req, res) => {
   if(!req.file) {
      res.status(400);
      throw new Error('no file uploaded');
   }
   try {
      
      const result = await cloudinary.uploader.upload(req.file.path, {
         folder: 'writer-in',
         context: `alt=${req.file.originalname.split('.')[0]}`,
         public_id: req.file.filename
      })
      if(!result) {
         throw new Error('file upload failed');
      }
      await fs.unlinkSync(req.file.path);
      res.json({
         message:'file uploaded',
         result
      })
   } catch (error) {
      throw new Error(error);
   }
})

module.exports = { uploadFile };