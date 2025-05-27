require("dotenv").config();
const { hashPassword } = require("../utilities/hashing&tokens");
const { query } = require("../database/db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

        // Insert new user
        const result = await query(insertQuery, [
            user_name,
            email,
            hashedPassword,
            hashedToken,
        ]);

        if (result.rowCount === 1) {
            const transporter = nodemailer.createTransport({
                service: process.env.service,
                auth: {
                    user: process.env.adminEmail,
                    pass: process.env.nodemailerPas,
                },
            });

            const verificationLink = `${req.protocol}://${req.get(
                "host"
            )}/api/auth/verify?token=${token}&email=${email}`;

            const mailOptions = {
                from: process.env.adminEmail,
                to: email,
                subject: "Verify Your Email Address",
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
                `,
            };

            await transporter.sendMail(mailOptions);

            return res.status(201).json({
                message:
                    "Registration successful. Please check your email to verify your account.",
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
