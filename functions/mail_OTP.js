const send_mail = require('./jwt_token');
const _Error = require('../utils/_error');

const mail_OTP = async (params) => {
  const { user, message, subject, next, res } = params;

  const OTP = await user.generateOTP();
  await user.save({ validateBeforeSave: false });

  try {
    await send_mail({
      email: user.email,
      subject,
      message: `${message} OTP - ${OTP}`,
    });

    res.status(200).json({
      status: 200,
      message: 'OTP sent to email!',
    });
  } catch (error) {
    console.log(error);
    user.OTP = undefined;
    user.OTPExpiration = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new _Error('Email could not be sent', 500));
  }
};

module.exports = mail_OTP;
