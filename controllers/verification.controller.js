/* eslint-disable consistent-return */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

// `Models
const User = require('../database/models/user.model');

// `Utils
const _Error = require('../utils/_error');
const catch_async = require('../utils/catch_async');

exports.set_authorized = catch_async(
  async (req, res, next) => {
    let token;
    if (req.headers.authorization) {
      if (req.headers.authorization.startsWith('Bearer')) {
        // eslint-disable-next-line prefer-destructuring
        token = req.headers.authorization.split(' ')[1];
      } else {
        token = req.headers.authorization;
      }
    }
    if (req.cookies.authorization) {
      token = req.cookies.authorization;
    }

    if (!token) {
      return next(new _Error('You are not logged in', 401));
    }
    const authorized = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    req.authorized = authorized;
    next();
  }
);
