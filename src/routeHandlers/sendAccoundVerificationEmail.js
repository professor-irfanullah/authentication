require("dotenv").config();
const crypto = require("crypto");
const { hashPassword } = require("../utilities/hashing&tokens");
const { query } = require("../database/db");
const { sendEmail } = require('../sendGrid/sendGridVerificationEmail')
const sendEmailForAccountVerification = async (req, res, next) => {

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
            await sendEmail(email, verification_link)
            res.status(200).json({
                msg: `A verification email is being sent to ${email} `,
            });
            return;
        }
        res.status(404).json({ err: "User not found" });
    } catch (error) {
        if (error.code === 'ENOTFOUND') {
            const err = new Error('Network disconnencted')
            return next(err)
        }
        next(error);
    }
};

module.exports = { sendEmailForAccountVerification };
