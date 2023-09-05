/*module setup*/
require('express-async-errors');
require('dotenv').config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const session_params = require('./sessionConfig');
const xssClean = require('./middleware/xssClean');
/*security packages*/
const cors = require('cors');
const favicon = require('express-favicon');
const logger = require('morgan');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const cloudinary = require('cloudinary');

/*routes*/
const mainRouter = require('./routes/mainRouter.js');
const authRouter = require('./routes/auth_routes.js');
const recipeRouter = require('./routes/recipe_routes');
const mealRouter = require('./routes/mealPlanner_routes');
const shoppingListRouter = require('./routes/shoppingList_routes');
const sendMail = require('./routes/sendMail_route');

/*middleware*/
const authMiddleware = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const emailRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 5 requests per windowMs
});

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:3005',
    // credentials: true,
  })
);
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(xssClean);
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(session(session_params));

/* routes */
app.use('/api/v1', mainRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/recipes', authMiddleware, recipeRouter);
app.use('/api/v1/meal-planner', authMiddleware, mealRouter);
app.use('/api/v1/shopping-list', authMiddleware, shoppingListRouter);
app.use('/api/v1/sendmail', emailRateLimiter, authMiddleware, sendMail);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
