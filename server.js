const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
require('./database');

const app = require('./app');

const port = process.env.PORT;

app.listen(process.env.PORT, () => {
  console.log(
    `Administrator Server Running on PORT : '${port}'`
  );
  console.log(
    `Server Environment : '${process.env.NODE_ENV}'`
  );
});
