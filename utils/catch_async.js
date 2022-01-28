const Mongoose = require('mongoose');

module.exports = (fun) => {
  const to_return = async (req, res, next) => {
    const session = await Mongoose.startSession();
    session.startTransaction();
    fun(req, res, next, session)
      .then(async () => {
        await session.commitTransaction();
        session.endSession();
      })
      .catch(async (error) => {
        await session.abortTransaction();
        session.endSession();
        next(error);
      });
  };
  return to_return;
};
