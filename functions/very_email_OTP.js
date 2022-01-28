const User = require('../database/models/app_user.model');
const _Error = require('../utils/_error');

const very_email_OTP = async (params) => {
  const { OTP, next } = params;

  const user = await User.findOne({
    OTPExpiration: { $gt: Date.now() },
    OTP,
  });

  if (!user) {
    return next(new _Error('Invalid OTP', 400));
  }

  if (user.OTPExpiration < Date.now()) {
    return next(new _Error('OTP has expired', 404));
  }

  user.resetOTP = undefined;
  user.resetOTPExpiration = undefined;

  await user.save();

  return user;
};

module.exports = very_email_OTP;
