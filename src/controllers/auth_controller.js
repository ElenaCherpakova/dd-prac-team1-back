const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');
const ShoppingList = require('../models/ShoppingList');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Account already exists.');
  }

  const user = await User.create({ username, email, password });

  // Create an empty shopping list for the new user
  const emptyShoppingList = new ShoppingList({ 
    userID: user._id, 
    ingredients: [] 
  });
  await emptyShoppingList.save();
  
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { username: user.username }, token });
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
      const errorMessage = 'Logout failed';
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    } else {
      return res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
    }
  });
};

module.exports = {
  register,
  login,
  logout,
};

