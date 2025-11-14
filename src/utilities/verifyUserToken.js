const { query } = require('../database/db');
const { verifyPassowrd, tokenVerification } = require('../utilities/hashing&tokens');
const tempErrorHandler = (msg, stat = 400) => {
    const err = new Error(msg)
    err.status = stat
    return err
}
const verifyUserIdentity = async (req, res, next) => {
    const { token, email, redirectURL } = req.query
    if (!token) {
        return next(tempErrorHandler('Missing argument'))
    }
    if (!email) {
        return next(tempErrorHandler('Missing argument'))
    }

    try {
        const isVerifiedToken = tokenVerification(token)
        await query('UPDATE users SET is_verified = $1 WHERE email = $2', [true, isVerifiedToken.email])
        if (redirectURL) {
            // fit for current Local development 
            return res.redirect(redirectURL)
        }
        res.status(200).json({ msg: "Verification Successfull" })

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            console.log(error);

            return next(error)
        }
        if (error.name === 'TokenExpiredError') {
            return next(tempErrorHandler('Token Expired'))
        }
        console.log(error.name);
        res.status(500).json({ err: "Something went wrong" })
    }
}
/** 
const verifyUserIdentity = async (req, res) => {
    const { token, email } = req.query;

    const verificationQuery = `UPDATE users SET is_verified = $1 WHERE email = $2`;
    const fetchToken = `SELECT verification_token FROM users WHERE email = $1 AND is_verified = $2`;

    if (!token) {
        return res.status(400).json({ err: "Invalid verification link" });
    }

    if (!email) {
        return res.status(400).json({ err: 'Email is required' });
    }
    try {

        const result = await query(fetchToken, [email, false]);

        if (!result.rows.length) {
            return res.status(404).json({ err: 'User not found or already verified' });
        }

        const fetchedToken = result.rows[0].verification_token;
        const isTokenValid = await verifyPassowrd(token, fetchedToken);

        if (!isTokenValid) {
            return res.status(401).json({ err: 'Invalid verification token' });
        }

        const updateResult = await query(verificationQuery, [true, email]);

        if (updateResult.rowCount === 1) {
            return res.status(200).json({ msg: 'Verification successful' });
        }

        return res.status(500).json({ err: 'Failed to update verification status' });
    } catch (err) {
        res.status(500).json({ err: 'Internal server error' });
    }
};
*/

module.exports = { verifyUserIdentity };
