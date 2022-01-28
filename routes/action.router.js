const express = require('express');

const action_controller = require('../controllers/action.controller');
const verification_controller = require('../controllers/verification.controller');

const action_router = express.Router();

// Authenticate routes
action_router.use(verification_controller.set_authorized);

action_router
  .route('/up_vote/:id')
  .post(action_controller.up_vote);

action_router
  .route('/down_vote/:id')
  .post(action_controller.down_vote);

module.exports = action_router;
