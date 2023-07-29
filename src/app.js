/*module setup*/
require('express-async-errors');
require('dotenv').config();

const express = require('express');
const app = express();
// const axios = require('axios');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const session_params = require('./sessionConfig');

/*security packages*/
const cors = require('cors');
const favicon = require('express-favicon');
const logger = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');

/* middleware */
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

/*routes*/
const mainRouter = require('./routes/mainRouter.js');
const authRouter = require('./routes/auth_routes.js');
const aiRecipeRouter = require('./routes/apiRecipe_routes');
const authMiddleware = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(session(session_params));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

/* routes */
app.use('/api/v1', mainRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/ai-recipe', authMiddleware, aiRecipeRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
