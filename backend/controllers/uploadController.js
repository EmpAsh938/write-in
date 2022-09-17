const cloudinary = require('cloudinary').v2;

const uploadFile = (async (req, res) => {
   if(!req.file) {
      res.status(400);
      throw new Error('no file uploaded');
   }
   try {
      
      const result = await cloudinary.uploader.upload(req.file.path, {
         folder: '',
         public_id: ''
      })
   } catch (error) {
      throw new Error(error);
   }
   res.json({
      success:'file uploaded'
   })
})

module.exports = { uploadFile };