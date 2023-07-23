/*module setup*/
require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')

/*security packages*/
const cors = require('cors');
const favicon = require('express-favicon');
const logger = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');

/*routes*/
const mainRouter = require('./routes/mainRouter.js');
const authRouter = require('./routes/auth_routes.js');

/* middleware */
app.use(cookieParser());
app.use(logger('dev'));
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

app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

/* routes */
app.use('/api/v1', mainRouter);
app.use('/api/v1/auth', authRouter);

module.exports = app;