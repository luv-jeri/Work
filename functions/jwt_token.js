const jwt = require('jsonwebtoken');

const jwt_token = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );

module.exports = jwt_token;
