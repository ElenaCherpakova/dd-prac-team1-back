const CustomAPIError = require('./custom-api');
const UnauthenticatedError = require('./unauthenticated');
const BadRequestError = require('./bad-request');
const NotFoundError = require('./not-found');
const MulterError = require('./multer');

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
  MulterError
};
