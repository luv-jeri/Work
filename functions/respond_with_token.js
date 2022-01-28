const jwt_token = require('./jwt_token');

const respond_with_token = (user, status, res) => {
  const token = jwt_token(user);

  const cookie_options = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: false,
    // secure: true,
  };

  res.cookie('authorization', token, cookie_options);

  // `Remove password from output
  // eslint-disable-next-line no-param-reassign
  user.password = undefined;

  res.status(status).json({
    status,
    data: user,
    token,
  });
};

module.exports = respond_with_token;
