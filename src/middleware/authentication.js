const User = require('./models/User');
const jwt = require('jsonwebtoken');

const { Unauthenticated } = require('../errors');

const authenticationMiddleware = async (req, res, next) => {
  // check header
  const authHeader = req.header.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new Unauthenticated('Authentication invalid');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, userName } = payload;
    // attach the user to the recipe routes
    req.user = { userId, userName };
    next();
  } catch (err) {
    throw new Unauthenticated('Authentication invalid');
  }
};

module.exports = authenticationMiddleware;
