const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Account already exists.');
  }

  const user = await User.create({ username, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { username: user.username }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('Invalid email');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid password');
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { username: user.username, email: user.email }, token });
};

const logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      throw new UnauthenticatedError('Logout failed');
    }
    res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
  });
};

module.exports = {
  register,
  login,
  logout,
};
