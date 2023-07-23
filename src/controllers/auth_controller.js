const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        throw new BadRequestError('The passwords entered do not match.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new BadRequestError('That email address is already registered.');
    }

    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res
        .status(StatusCodes.CREATED)
        .json({ user: { username: user.username }, token })
}
const login = async (req, res) => {
    const { email, password } = req.body

    if ( !email || !password ) {
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({ email })
    
    if( !user ) {
        throw new UnauthenticatedError ('Invalid credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if( !isPasswordCorrect ) {
        throw new UnauthenticatedError ('Invalid password')
    }
    // compare password
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { email:user.email }, token })
}

module.exports = {
    register,
    login,
}