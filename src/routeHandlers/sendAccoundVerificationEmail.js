const nodemailer = require('nodemailer')
require("dotenv").config();
const crypto = require('crypto')
const { hashPassword } = require('../utilities/hashing&tokens')
const { query } = require('../database/db')
const sendEmailForAccountVerification = async (req, res, next) => {
    const upd_query = `update users set verification_token = $1 , updated_at = now() where email = $2`
    const { email } = req.query
    const token = crypto.randomBytes(32).toString('hex')
    const verifcation_link = `${req.protocol}://${req.get('host')}/api/auth/verify?token=${token}&email=${email}`
    try {
        const hashedToken = await hashPassword(token)
        const response = await query(upd_query, [hashedToken, email])
        if (response.rowCount === 1) {
            const transporter = nodemailer.createTransport({
                service: process.env.service,
                auth: {
                    user: process.env.adminEmail,
                    pass: process.env.nodemailerPas
                }
            })
            const isVerified = await transporter.verify()
            console.log(isVerified);
            if (isVerified) {
                const mailOptions = {
                    from: process.env.adminEmail,
                    to: email,
                    subject: 'Verify Your Email - Welcome to Job Connect',
                    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #2c3e50;">Welcome to Job Connect!</h2>
                <p>Thank you for signing up. To complete your registration and start exploring job opportunities, please verify your email address.</p>
                <p style="margin: 20px 0;">
                    <a href="${verifcation_link}" 
                       style="display: inline-block; padding: 12px 20px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 5px;">
                        Confirm Email Address
                    </a>
                </p>
                <p>If you did not create an account on our job board, you can safely ignore this email.</p>
                <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #888;">Need help? Contact our support team at khanprofessor1212@gmail.com</p>
            </div>`

                }
                await transporter.sendMail(mailOptions)
                return res.status(200).json({ msg: 'an Email was sent' })
            }
            res.status(500).json({ err: "Unable to send email" })
        }
    } catch (error) {
        console.log(error);

        next(error)
    }
}
module.exports = { sendEmailForAccountVerification }