const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dhcvubbbm', 
    api_key: '752917991662222', 
    api_secret: 'hFx82XHUoBtdGbmlD8oDK3cAJ00' 
  });

module.exports = cloudinary;