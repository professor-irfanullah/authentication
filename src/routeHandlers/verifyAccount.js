const { query } = require('../database/db')
const verifyAccount = async (req, res, next) => {


    const chk_email = `select is_verified, email as user_email from users where email = $1`
    const { email } = req.body
    if (!email) {
        const err = new Error("Email is required")
        err.status = 400
        return next(err)
    }
    try {
        const response = await query(chk_email, [email])
        if (response.rows.length === 0) {
            const err = new Error('User not Found..')
            err.status = 404
            return next(err)
        }
        const { is_verified, user_email } = response.rows[0]
        if (is_verified) {
            return res.status(200).json({ msg: "Email is verified" })

        }
        return res.status(403).json({ err: "Email is not verified", is_verified: is_verified, email: user_email })
    } catch (error) {
        next(error)
    }
}
module.exports = { verifyAccount }