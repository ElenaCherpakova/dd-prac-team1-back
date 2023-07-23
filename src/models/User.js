const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide your Username'],
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: 6,
        // SECURITY
        match: [
            /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$&*])(?=.{8,})/,
            "Passwords must have at least 6 characters with at least one lower case letter, at least one upper case letter, at least one number, and at least one of the characters ! @ # $ & * . ",
        ],
    },
})

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId:   this._id, email:this.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_LIFETIME,
        }
    )
}

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)