const express = require('express');
const movie_controller = require('../controllers/movie.controller');
const action_controller = require('../controllers/action.controller');
const verification_controller = require('../controllers/verification.controller');

const movie_router = express.Router();

// Authenticate routes
movie_router.use(verification_controller.set_authorized);

movie_router
  .route('/')
  .get(movie_controller.get)
  .delete(movie_controller.clear);

movie_router
  .route('/:id')
  .get(movie_controller.get_by_id)
  .patch(movie_controller.update)
  .delete(movie_controller.remove);

movie_router
  .route('/look/:name')
  .get(movie_controller.look);

movie_router.route('/dummy').post(movie_controller.dummy);

module.exports = movie_router;
