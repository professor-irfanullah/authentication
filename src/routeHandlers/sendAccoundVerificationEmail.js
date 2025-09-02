require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { hashPassword } = require("../utilities/hashing&tokens");
const { query } = require("../database/db");

const sendEmailForAccountVerification = async (req, res, next) => {
    const adminEmail = process.env.adminEmail;
    const nodemPas = process.env.nodemailerPas;

    const upd_query = `update users set verification_token = $1 , updated_at = now() where email = $2`;
    const { email } = req.query;
    if (!email) {
        const error = new Error("Email is required..");
        error.status = 400;
        return next(error);
    }

    const token = crypto.randomBytes(32).toString("hex");
    const verification_link = `${req.protocol}://${req.get(
        "host"
    )}/api/auth/verify?token=${token}&email=${email}`;

    try {
        const hashedToken = await hashPassword(token);
        const response = await query(upd_query, [hashedToken, email]);

        if (response.rowCount === 1) {
            // Respond to frontend immediately
            res.status(200).json({
                msg: `A verification email is being sent to ${email}.`,
            });

            // --- Transporter with full debug enabled ---
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // SSL
                auth: {
                    user: adminEmail,
                    pass: nodemPas,
                },
                logger: true, // log SMTP traffic
                debug: true, // include debug output
            });

            // Verify connection right away (will log errors to Railway)
            transporter.verify((error, success) => {
                if (error) {
                    console.error("❌ SMTP connection failed:", error);
                } else {
                    console.log("✅ SMTP server is ready:", success);
                }
            });

            const mailOptions = {
                from: adminEmail,
                to: email,
                subject: "Verify Your Email - Welcome to Job Connect",
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

            // --- Force log success/failure ---
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("❌ Email sending failed:", err);
                } else {
                    console.log("✅ Email sent successfully:", info.response);
                }
            });

            return;
        }

        res.status(404).json({ err: "User not found" });
    } catch (error) {
        console.error("Email verification error:", error);
        next(error);
    }
};

module.exports = { sendEmailForAccountVerification };
