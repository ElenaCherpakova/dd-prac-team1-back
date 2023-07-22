require('dotenv').config();
const PORT = process.env.PORT || 8000;
const app = require('./app');
const connectDB = require('./db/connect');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

/* database connection */
const url = process.env.MONGO_URL;

const store = new MongoDBStore({
  uri: url,
  collection: 'sessions',
});
store.on('error', () => {
  console.log(error);
});

const listener = () => console.log(`Listening on Port ${PORT}...`);

const start = async () => {
  try {
    await connectDB(url);
    // console.log('DB connection established');
    app.listen(PORT, listener);
  } catch (error) {
    console.log(error);
  }
};
start();
