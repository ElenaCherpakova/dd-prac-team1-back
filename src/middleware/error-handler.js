const { StatusCodes } = require('http-status-codes');

MONGO_ERR_DUPLICATE_ENTRY = 11000;

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  };
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = 400;
  }
  if (err.code && err.code === MONGO_ERR_DUPLICATE_ENTRY) {
    customError.msg = `Duplicate value entered value for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }
  if (err.name === 'TokenExpiredError') {
    customError.msg = err.userMessage || 'Session expired, please login again';
    customError.statusCode = 401;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
