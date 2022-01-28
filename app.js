const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const error_handler = require('./handlers/error.handler');
const _Error = require('./utils/_error');

const origin = [
  'http://localhost:3000/',
  'http://localhost:3000',
];

const app = express();

//* to add cookies if CORS
app.use(
  cors({
    origin,
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message:
    'Too many requests from this IP, please try again later',
});
// * Set security HTTP headers
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'genre',
      'rating',
      'director',
      'actors',
      'language',
      'releaseDate',
      'duration',
    ],
  })
);
//*  Express Middleware
app.use('/api', limiter);
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(compression());
// if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev')); // ? Middleware to show req and res details.
// }

//* Serving Documentation HTML file
app.use(express.static(`${__dirname}/public`));

//* Routes handling

app.use(
  '/api/v1/authentication',
  require('./routes/authentication.router')
);

app.use('/api/v1/movie', require('./routes/movie.router'));
app.use(
  '/api/v1/action',
  require('./routes/action.router')
);

//* Error handling middleware
app.all('*', (req, res, next) => {
  next(new _Error(`Can't find ${req.path} :(`, 404));
});

app.use(error_handler);

module.exports = app;
