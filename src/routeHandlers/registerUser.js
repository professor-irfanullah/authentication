require('dotenv').config()
const { hashPassword } = require('../utilities/hashing&tokens')
const { query } = require('../database/db')
const crypto = require('crypto')
const nodemailer = require('nodemailer')



const registerUser = async (req, res, next) => {
    const { user_name, email, password } = req.body
    const insertQuery = `insert into users(name , email , password , verification_token )
    values(?, ?, ? , ?)
    `
    const duplicateCheckQuery = `select * from users where email = ? and is_verified = ?`
    try {
        const token = crypto.randomBytes(32).toString('hex')

        const hashedToken = await hashPassword(token)
        const hashedPassword = await hashPassword(password)
        const isDuplicateEmail = await query(duplicateCheckQuery, [email, false])
        if (isDuplicateEmail.length) {
            return res.status(403).json({ msg: `This email '${email}' is already taken` })
        }
        const register = await query(insertQuery, [user_name, email, hashedPassword, hashedToken])
        if (register.affectedRows === 1) {
            const transporter = nodemailer.createTransport({
                service: process.env.service,
                auth: {
                    user: process.env.adminEmail,
                    pass: process.env.nodemailerPas
                }
            })
            const verificationLink = `${req.protocol}://${req.get('host')}/api/auth/verify?token=${token}&email=${email}`
            const mailOptions = {
                from: process.env.adminEmail,
                to: email,
                subject: 'Verify Your Email Address',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Welcome to Secure Authentication System!</h2>
                        <p>Please verify your email address to complete your registration.</p>
                        <a href="${verificationLink}" 
                           style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                            Verify Email
                        </a>
                        <p>If you didn't request this, please ignore this email.</p>
                    </div>
                `
            }
            transporter.sendMail(mailOptions)
            return res.status(201).json({
                message: 'Registration successful. Please check your email to verify your account.'
            });
        }
        // res.send(verificationLink)
    } catch (error) {
        const err = new Error(error)
        next(err)
    }
}
module.exports = { registerUser }