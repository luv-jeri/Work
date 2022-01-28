const Mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new Mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Provide a Movie title'],
    },
    byUser: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    poster: {
      type: String,
      required: [true, 'Provide a Movie poster'],
      validate: [validator.isURL, 'Provide a valid URL'],
    },
    description: {
      type: String,
      required: [true, 'Provide a Movie description'],
    },
    rating: {
      type: Number,
      default: 0,
      range: [0, 5],
    },
    upVote: {
      type: Number,
      default: 0,
    },
    downVote: {
      type: Number,
      default: 0,
    },
    releaseDate: {
      type: Date,
      required: [true, 'Provide a Movie release date'],
      validator: [
        validator.isISO8601,
        'Provide a valid date',
      ],
    },
    duration: {
      type: Number,
      required: [true, 'Provide a Movie duration'],
    },
    genre: {
      type: String,
      required: [true, 'Provide a Movie genre'],
      enum: [
        'Action',
        'Adventure',
        'Comedy',
        'Drama',
        'Horror',
        'Romance',
        'Thriller',
        'Science Fiction',
      ],
    },
    director: {
      type: String,
      required: [true, 'Provide a Movie director'],
    },
    actors: {
      type: [String],
      required: [true, 'Provide a Movie actors'],
    },
    trailer: {
      type: String,
      required: [true, 'Provide a Movie trailer'],
      validator: [validator.isURL, 'Provide a valid URL'],
    },
    language: {
      type: String,
      required: [true, 'Provide a Movie language'],
      enum: [
        'English',
        'Hindi',
        'Tamil',
        'Telugu',
        'Malayalam',
        'Kannada',
        'Bengali',
        'Marathi',
        'Gujarati',
        'Punjabi',
        'Oriya',
        'Urdu',
      ],
    },
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

movieSchema.index({
  title: 'text',
});

movieSchema.index(
  { title: 1, director: 1, releaseDate: 1 },
  { unique: true }
);

const Movie = Mongoose.model('movie', movieSchema);

module.exports = Movie;
