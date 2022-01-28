/* eslint-disable consistent-return */
// `Models
const User = require('../database/models/user.model');
// `Utils
const _Error = require('../utils/_error');
const catch_async = require('../utils/catch_async');
// `Functions
const send_mail = require('../functions/send_mail.function');
const respond_with_token = require('../functions/respond_with_token');

// #Signup
exports.sign_up = catch_async(async (req, res, next) => {
  const {
    email,
    phone,
    name,
    password,
    passwordConfirm,
    key,
    photo,
  } = req.body;
  // If body have email or phone number
  if (!email) {
    return next(new _Error('Please provide Email ID', 400));
  }

  // Check if user already exists in database
  const user = await User.findOne({
    email,
  });
  if (user) {
    return next(new _Error('User already exists', 400));
  }

  // Create new user
  const new_user = await User.create({
    email,
    name,
    password,
    passwordConfirm,
    phone,
    photo,
    role: 'user',
  });

  await new_user.verificationOTP();
  await new_user.save({ validateBeforeSave: false });

  respond_with_token(new_user, 200, res, req);
});

// #SignIn
exports.sign_in = catch_async(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new _Error('Please provide email', 400));
  }

  const user = await User.findOne({
    email,
  }).select('+password');

  if (!user) {
    return next(new _Error('No user found', 401));
  }

  if (
    !(await user.matchPassword(password, user.password))
  ) {
    return next(
      new _Error('Invalid email or password', 400)
    );
  }

  respond_with_token(user, 200, res, req);
});

// #Send forgot_password token to the mail
exports.forgot_password = catch_async(
  async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      return next(
        new _Error('Please provide email/phone ', 400)
      );
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return next(
        new _Error(
          'No user found with that email/phone',
          404
        )
      );
    }

    const OTP = await user.generateOTP();
    await user.save({ validateBeforeSave: false });

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password -  OTP ${OTP}`;

    try {
      await send_mail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      console.log(err);
      user.resetOTP = undefined;
      user.resetOTPExpiration = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new _Error('Email could not be sent', 500)
      );
    }
  }
);
// #Reset password using reset token
exports.reset_password = catch_async(
  async (req, res, next) => {
    const user = await User.findOne({
      resetOTP: req.params.token,
      resetOTPExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return next(new _Error('Invalid OTP', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.resetOTP = undefined;
    user.resetOTPExpiration = undefined;

    await user.save();
    respond_with_token(user, 200, res, req);
  }
);

// #Update password
exports.update_password = catch_async(
  async (req, res, next) => {
    const user = await User.findById(
      req.authorized.id
    ).select('+password');
    if (
      !(await user.matchPassword(
        req.body.currentPassword,
        user.password
      ))
    ) {
      return next(new _Error('Password is incorrect', 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    respond_with_token(user, 200, res, req);
  }
);
