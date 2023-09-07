const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
});
store.on('error', (error) => {
  console.log(error);
});

// Configure session parameters
const session_params = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: true,
    sameSite: 'strict',
  },
};

// Configure secure session settings for production environment
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  session_params.cookie.secure = true;
}

module.exports = session_params;
