require("dotenv").config();
const sgMail = require('@sendgrid/mail')
const crypto = require("crypto");
const { hashPassword } = require("../utilities/hashing&tokens");
const { query } = require("../database/db");
const { sendEmail } = require('../sendGrid/sendGridVerificationEmail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
            await sendEmail(email, verification_link)
            return;
        }

        res.status(404).json({ err: "User not found" });
    } catch (error) {
        console.error("Email verification error:", error);
        next(error);
    }
};

module.exports = { sendEmailForAccountVerification };
