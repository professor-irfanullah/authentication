require("dotenv").config();
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { hashPassword } = require('../utilities/hashing&tokens')
const { query } = require('../database/db')
const sendEmailForAccountVerification = async (req, res, next) => {
    const email = process.env.adminEmail
    const nodemPas = process.env.nodemailerPas
    const service = process.env.service
    const query = req.query
    res.json({ email, nodemPas, service, query })
    /*
    const upd_query = `update users set verification_token = $1 , updated_at = now() where email = $2`;
    const { email } = req.query;
    const token = crypto.randomBytes(32).toString('hex');
    const verification_link = `${req.protocol}://${req.get('host')}/api/auth/verify?token=${token}&email=${email}`;

    try {
        const hashedToken = await hashPassword(token);
        const response = await query(upd_query, [hashedToken, email]);

        if (response.rowCount === 1) {
            // Respond to frontend immediately
            res.status(200).json({
                msg: `A verification email is being sent to ${email}.`,
            });

            // Proceed with email sending in background
            const transporter = nodemailer.createTransport({
                service: process.env.service,
                auth: {
                    user: process.env.adminEmail,
                    pass: process.env.nodemailerPas,
                },
            });

            // Optionally verify once at app startup instead of per request
            // await transporter.verify();

            const mailOptions = {
                from: process.env.adminEmail,
                to: email,
                subject: 'Verify Your Email - Welcome to Job Connect',
                html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #2c3e50;">Welcome to Job Connect!</h2>
                    <p>Thank you for signing up. To complete your registration and start exploring job opportunities, please verify your email address.</p>
                    <p style="margin: 20px 0;">
                        <a href="${verification_link}" 
                           style="display: inline-block; padding: 12px 20px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 5px;">
                            Confirm Email Address
                        </a>
                    </p>
                    <p>If you did not create an account on our job board, you can safely ignore this email.</p>
                    <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #888;">Need help? Contact our support team at khanprofessor1212@gmail.com</p>
                </div>`,
            };

            // Send email in background
            transporter.sendMail(mailOptions).catch((err) => {
                console.error("Email sending failed:", err);
                // Optionally: log this somewhere or send an alert
            });

            return; // Important: don't send another response
        }

        res.status(404).json({ err: "User not found" });

    } catch (error) {
        console.error("Email verification error:", error);
        next(error);
    }
        */
};

module.exports = { sendEmailForAccountVerification }