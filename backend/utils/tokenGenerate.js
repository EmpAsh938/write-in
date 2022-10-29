const jwt = require('jsonwebtoken');

const tokenGenerate = async (creds) => {
    const token = await jwt.sign(creds,process.env.JWT_SECRET, { expiresIn: "1D" });
    return token;
}

module.exports = { tokenGenerate }
