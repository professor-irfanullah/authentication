const { query } = require("../database/db")

const verifyAccountStatus = async (req, res, next) => {
    const { email } = req.query
    if (!email) {
        const err = new Error('Please provide a valid email address!')
        err.status = 400
        return next(err)
    }
    const statusQuery = `select * from users where email = ?`
    try {
        const status = await query(statusQuery, [email])
        if (status.length) {
            const is_verified = status[0].is_verified
            if (is_verified === 1) {
                return res.status(200).json({ msg: 'Your email is in active state' })
            }
            const err = new Error(`This email '${email}' is currently not verified, please verify your email to proceed!`)
            err.status = 403
            return next(err)
        }
        const err = new Error(`user with this email '${email}' does not exists!`)
        err.status = 404
        next(err)

    } catch (error) {
        res.send(error)
    }
}
module.exports = { verifyAccountStatus }