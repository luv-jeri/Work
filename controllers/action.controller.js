const User = require('../database/models/user.model');
const Movie = require('../database/models/movie.model');

// `Utils
const _Error = require('../utils/_error');
const catch_async = require('../utils/catch_async');

exports.up_vote = catch_async(
  async (req, res, next, session) => {
    const { id } = req.params;
    const user = await User.findById(req.authorized.id);

    if (!user) {
      return next(_Error('User not found', 404));
    }
    const movie = await Movie.findById(id);

    if (!movie)
      return next(new _Error('Movie not found', 404));

    if (user.liked.includes(id)) {
      // Already liked , unlike it
      movie.upVote--;
      user.liked.splice(user.liked.indexOf(id), 1);
    } else {
      // like the movie
      movie.upVote++;
      user.liked.push(id);
      // remove if disliked
      if (user.disliked.includes(id)) {
        movie.downVote--;
        user.disliked.splice(user.disliked.indexOf(id), 1);
      }
    }

    await movie.save({ session });
    await user.save({ session });

    res.status(200).json({
      status: 'success',
      data: movie,
      message: 'Movie upVoted successfully',
    });
  }
);
exports.down_vote = catch_async(
  async (req, res, next, session) => {
    const { id } = req.params;
    const user = await User.findById(req.authorized.id);

    if (!user) {
      return next(_Error('User not found', 404));
    }
    const movie = await Movie.findById(id);

    if (!movie)
      return next(new _Error('Movie not found', 404));

    if (user.disliked.includes(id)) {
      // Already disliked , unlike it
      movie.downVote--;
      user.disliked.splice(user.disliked.indexOf(id), 1);
    } else {
      // dislike the movie
      movie.downVote++;
      user.disliked.push(id);
      // remove if liked
      if (user.liked.includes(id)) {
        movie.upVote--;
        user.liked.splice(user.liked.indexOf(id), 1);
      }
    }

    await movie.save({ session });
    await user.save({ session });

    res.status(200).json({
      status: 'success',
      data: movie,
      message: 'Movie downVoted successfully',
    });
  }
);
