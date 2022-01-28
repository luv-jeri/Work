const Models = require('../helpers/models.helper');
// `Handlers
const crud = require('../handlers/crud.handler');
// `Utils
const _Error = require('../utils/_error');
const catch_async = require('../utils/catch_async');

// ` Data
const movies = require('../database/temp/movies.json');

exports.post = crud.create('Movie', [
  'title',
  'poster',
  'description',
  'genre',
  'rating',
  'director',
  'actors',
  'language',
  'releaseDate',
  'duration',
  'trailer',
]);

exports.get = crud.find('Movie');
exports.get_by_id = crud.find_by_id('Movie');

exports.remove = crud.remove('Movie');

exports.update = crud.update('Movie', [
  'title',
  'poster',
  'description',
  'genre',
  'rating',
  'director',
  'actors',
  'language',
  'releaseDate',
  'duration',
  'trailer',
]);

exports.look = catch_async(async (req, res, next) => {
  const { name } = req.params;
  // Full text search
  const movie = await Models.Movie.find({
    $text: {
      $search: name,
    },
  });

  if (!movie) return next(_Error('Movie not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

exports.dummy = catch_async(async (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return next(
      _Error(
        'Not allowed Please Switch to development Mode',
        403
      )
    );
  }

  const data = JSON.parse(JSON.stringify(movies)).map(
    (movie) => ({ byUser: req.authorized.id, ...movie })
  );

  const movies_ = await Models.Movie.create(data);

  res.send(movies_);
});

exports.clear = catch_async(async (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return next(
      _Error(
        'Not allowed Please Switch to development Mode',
        403
      )
    );
  }
  await Models.Movie.deleteMany({});

  res.status(200).json({
    status: 'success',
    message: 'All movies deleted successfully',
    data: {},
  });
});
