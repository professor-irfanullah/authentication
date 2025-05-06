const { verifyPassowrd, createToken } = require('../utilities/hashing&tokens')
const { query } = require('../database/db')

const LoginUser = async (req, res, next) => {
    const { email, password } = req.body
    const Query = `select user_id , name , email, password , role from users where email = ? and is_verified = true`
    try {
        const response = await query(Query, [email])
        if (response.length) {
            const payload = {
                user_id: response[0].user_id,
                name: response[0].name,
                email: response[0].email,
                role: response[0].role
            }
            const isValid = await verifyPassowrd(password, response[0].password)

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