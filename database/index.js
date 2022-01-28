const mongoose = require('mongoose');

const { DATABASE } = process.env;

mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const database_connection = mongoose.connection;

if (database_connection) {
  console.log('Connected to Database URL :', DATABASE);
} else {
  console.log(
    'Connecting to Database URL.... : ',
    DATABASE
  );
}

module.exports = database_connection;
