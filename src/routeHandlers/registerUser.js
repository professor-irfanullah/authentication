require("dotenv").config();
const sendGrid = require('@sendgrid/mail')
const { hashPassword } = require("../utilities/hashing&tokens");
const { query } = require("../database/db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

const registerUser = async (req, res, next) => {
    const { user_name, email, password } = req.body;

    if (!user_name) {
        const err = new Error(`username is required`);
        err.status = 401;
        return next(err);
    }
    if (!email) {
        const err = new Error(`email is required`);
        err.status = 401;
        return next(err);
    }
    if (!password) {
        const err = new Error(`password is required`);
        err.status = 401;
        return next(err);
    }

    const insertQuery = `INSERT INTO users(name, email, password, verification_token)
                         VALUES ($1, $2, $3, $4)`;
    const duplicateCheckQuery = `SELECT * FROM users WHERE email = $1`;

    try {
        // Check if email already exists
        const existingUser = await query(duplicateCheckQuery, [email]);

        if (existingUser.rows.length) {
            const user = existingUser.rows[0];

            if (user.is_verified) {
                return res
                    .status(403)
                    .json({
                        msg: `This email '${email}' is already registered and verified.`,
                    });
            } else {
                return res
                    .status(403)
                    .json({
                        msg: `This email '${email}' is already registered but not verified. Please check your inbox.`,
                    });
            }
        }

        // Generate token and hash both token and password
        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = await hashPassword(token);
        const hashedPassword = await hashPassword(password);
        const verificationLink = `${req.protocol}://${req.get(
            "host"
        )}/api/auth/verify?token=${token}&email=${email}`;
        // Insert new user
        const result = await query(insertQuery, [
            user_name,
            email,
            hashedPassword,
            hashedToken,
        ]);

        if (result.rowCount === 1) {
            const msg = {
                to: email,
                from: process.env.adminEmail,
                subject: "Verify Your Email - Welcome to Job Connect",
                html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #2c3e50;">Welcome to Job Connect!</h2>
                <p>Thank you for signing up. To complete your registration and start exploring job opportunities, please verify your email address.</p>
                <p style="margin: 20px 0;">
                    <a href="${verificationLink}" 
                       style="display: inline-block; padding: 12px 20px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 5px;">
                        Confirm Email Address
                    </a>
                </p>
                <p>If you did not create an account on our job board, you can safely ignore this email.</p>
                <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #888;">Need help? Contact our support team at khanprofessor1212@gmail.com</p>
            </div>`,
            }
            sendGrid.send(msg)

            return res.status(201).json({
                msg:
                    `An Email has been sent to '${email}' please verify your account to proceed`,
            });
        }

        res
            .status(500)
            .json({ msg: "User registration failed for unknown reasons." });
    } catch (error) {
        const deleteQuery = `delete from users where email = $1`;
        // console.error('Registration error:', error);
        if (error.code === "EDNS" && error.command === "CONN") {
            const err = new Error("Looks like Network Disconnected!");
            const response = await query(deleteQuery, [email]);
            if (response.rowCount === 1) {
                return next(err);
            }
        }

        res.status(500).json({ err: error });
    }
};

module.exports = { registerUser };
