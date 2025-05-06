const { hashPassword } = require('../utilities/hashing&tokens')
const testHandler = (req, res, next) => {
    res.json({ msg: "this route" })
}

const registerUser = async (req, res, next) => {
    const { user_name, email, password } = req.body
    // hash the password
    try {
        const hash = await hashPassword(password)
        res.json({ hash })
    } catch (error) {
        res.json({ err: error })

    }
}
module.exports = { testHandler, registerUser }