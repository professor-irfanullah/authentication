require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}

const verifyPassowrd = async (current, hashed) => {
    const isVerified = await bcrypt.compare(current, hashed)
    return isVerified
}

const createToken = (payload) => {
    const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: process.env.jwtExpires })
    return token
}
const tokenVerification = (token) => {
    const verify = jwt.verify(token, process.env.jwtSecret)
    return verify
}
module.exports = { hashPassword, verifyPassowrd, createToken, tokenVerification }