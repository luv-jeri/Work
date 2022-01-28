const express = require('express');
// ` Controllers
const auth_controller = require('../controllers/authentication.controller');
const verification_controller = require('../controllers/verification.controller');

const authentication_router = express.Router();

authentication_router.post(
  '/sign_up',
  auth_controller.sign_up
);

authentication_router.post(
  '/sign_in',
  auth_controller.sign_in
);

authentication_router.use(
  verification_controller.set_authorized
);

authentication_router.post(
  '/forgot_password',
  auth_controller.forgot_password
);
authentication_router.post(
  '/reset_password/:token',
  auth_controller.reset_password
);

authentication_router.post(
  '/update_password',
  verification_controller.set_authorized,
  auth_controller.update_password
);

module.exports = authentication_router;
