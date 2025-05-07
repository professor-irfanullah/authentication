const { verifyPassowrd, createToken } = require('../utilities/hashing&tokens')
const { query } = require('../database/db')

const LoginUser = async (req, res, next) => {
    const { email, password } = req.body
    const Query = `select user_id , name , email, password , role from users where email = $1 and is_verified = $2`
    try {
        const response = await query(Query, [email, true])
        if (response.rows.length) {
            const payload = {
                user_id: response.rows[0].user_id,
                name: response.rows[0].name,
                email: response.rows[0].email,
                role: response.rows[0].role
            }
            const isValid = await verifyPassowrd(password, response.rows[0].password)

            if (isValid) {
                const token = createToken(payload)
                res.cookie('token', token, {
                    maxAge: 3600000,
                    httpOnly: true
                })
                return res.json(payload)
            }
            return res.status(401).json({ err: 'Invalid credentials' })
        }
        const err = new Error('User not found!')
        err.status = 404
        next(err)

    } catch (error) {

        const err = new Error(error)
        next(err)
    }
}
module.exports = { LoginUser }