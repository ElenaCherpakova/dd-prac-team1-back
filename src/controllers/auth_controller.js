const User = require('../models/User');
const ShoppingList = require('../models/ShoppingList');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');
const createTransporter = require('../mailerConfig');
const getHtmlTemplate = require('../helpers/getHtmlTemplate');
const URL_TO_RESET = 'http://localhost:3005/reset-password/';

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
    ingredients: [],
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
  res
    .status(StatusCodes.OK)
    .json({ user: { username: user.username, email: user.email }, token });
};

const logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      const errorMessage = 'Logout failed';
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
    } else {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Logged out successfully' });
    }
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw new BadRequestError('Please provide email');
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthenticatedError('Invalid email');
    }

    // Generate reset token and expiration
    const resetToken = user.createResetPasswordToken();
    user.passwordResetToken = resetToken;
    await user.save();

    const resetLink = `${URL_TO_RESET}${resetToken}`;

    // send email with the reset Link
    const transporter = await createTransporter();
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `Password Reset Request`,
      text: `Password Reset Request`,
      html: getHtmlTemplate('resetPassword.html', {
        resetLink,
      }),
    };
    await transporter.sendMail(mailOptions);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Email sent successfully' });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error sending email', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  if (!newPassword) {
    throw new BadRequestError('Please provide new password');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user || user.passwordResetToken !== token) {
      throw new UnauthenticatedError('Invalid token');
    }

    user.password = newPassword;
    user.passwordResetToken = null;

    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Password reset successfully' });
  } catch (error) {
    // Handle JWT-related errors
    if (error.name === 'TokenExpiredError') {
      throw new UnauthenticatedError('Reset token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new UnauthenticatedError('Invalid token');
    } else {
      // Directly handle generic errors without throwing for simplicity
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error resetting password' });
    }
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
