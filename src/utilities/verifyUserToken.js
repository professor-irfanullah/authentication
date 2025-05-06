const { query } = require('../database/db');
const { verifyPassowrd } = require('../utilities/hashing&tokens')
const verifyUserIdentity = async (req, res, next) => {
    const { token, email } = req.query
    const verificationQuery = `update users set is_verified = ? where email = ?`
    const fetchToken = `select verification_token from users where email = ? and is_verified = false`
    try {
        if (!token) {
            return res.status(400).json({ err: "invalid verification link" })
        }
        if (!email) {
            return res.status(400).json({ err: 'your Email account is required' })
        }
        try {
            const verificationToken = await query(fetchToken, [email])
            if (verificationToken.length) {
                const fetchedToken = verificationToken[0].verification_token
                const verifyToken = await verifyPassowrd(token, fetchedToken)
                if (verifyToken) {
                    const response = await query(verificationQuery, [true, email])
                    if (response.affectedRows === 1) {
                        return res.status(200).json({ msg: 'verification successful' })
                    }

                }

            }
            res.status(404).json({ err: 'unable to verify the user, the verification link is expired' })
        }
        catch (err) {
            res.status(500).json(err)

        }
    }
    catch (err) {
        res.send(err)
    }
}
module.exports = { verifyUserIdentity }