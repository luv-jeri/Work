const bcrypt = require('bcryptjs');

const middleware = (Schema) => {
  // eslint-disable-next-line consistent-return
  Schema.pre('save', async function (next) {
    if (!this.email) {
      next(new Error('Admin must have a email'));
    }

    next();
  });
  Schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  });

  Schema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew)
      return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
  });

  Schema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
  });
};

module.exports = middleware;
