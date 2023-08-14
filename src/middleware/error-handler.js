const { StatusCodes } = require('http-status-codes');
const CustomMulterError = require('../errors/multer');

const MONGO_ERR_DUPLICATE_ENTRY = 11000;

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  };

  if (err instanceof CustomMulterError) {
    if (err.errorType === 'LIMIT_FILE_SIZE') {
      customError.msg = 'Image size too large, max 5MB allowed';
      customError.statusCode = 400;
    } else if (err.errorType === 'INVALID_FILE_TYPE') {
      customError.msg = 'Invalid file type';
      customError.statusCode = 400;
    } else {
      customError.msg = 'Something went wrong, please try again later';
      customError.statusCode = 500;
    }
  }

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
