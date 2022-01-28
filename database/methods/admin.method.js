/* eslint-disable no-param-reassign */
const bcrypt = require('bcryptjs');

const methods = (Schema) => {
  Schema.methods.matchPassword = async function (
    to_match,
    password
  ) {
    const match = await bcrypt.compare(to_match, password);

    return match;
  };

  Schema.methods.isPasswordUpdated = function (
    JWTTimestamp
  ) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  };

  Schema.methods.generateOTP = async function () {
    const OTP = Math.floor(1000 + Math.random() * 9000);

    this.resetOTP = OTP;
    this.resetOTPExpiration = Date.now() + 10 * 60 * 1000;

    return OTP;
  };

  Schema.methods.verificationOTP = async function () {
    const OTP = Math.floor(1000 + Math.random() * 9000);

    this.emailVerificationOTP = OTP;
    this.emailVerificationOTPExpiration =
      Date.now() + 60 * 60 * 1000;

    return OTP;
  };
};

module.exports = methods;
