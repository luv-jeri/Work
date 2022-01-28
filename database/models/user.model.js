const Mongoose = require('mongoose');
const validator = require('validator');
const middleware = require('../middlewares/admin.middleware');
const methods = require('../methods/admin.method');

const adminSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Provide a name user. '],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: [
        validator.isEmail,
        'Please provide a valid email',
      ],
    },
    liked: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'movie',
      },
    ],
    disliked: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'movie',
      },
    ],
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 3,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      minlength: 3,
      select: false,
      validate: {
        validator(el) {
          return el === this.password;
        },
        message: 'Please check the password.',
      },
    },
    passwordChangedAt: Date,
    resetOTP: String,
    resetOTPExpiration: Date,
    emailVerificationOTP: String,
    emailVerificationOTPExpiration: Date,
    verifiedEmail: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    toString: {
      virtuals: true,
    },
  }
);

middleware(adminSchema);
methods(adminSchema);

const Admin = Mongoose.model('user', adminSchema);

module.exports = Admin;
