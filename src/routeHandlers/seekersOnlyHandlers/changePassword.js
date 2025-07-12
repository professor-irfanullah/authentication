const changePassword = async (req, res, next) => {
    const { query } = require('../../database/db')
    const { current, newPas, confirm } = req.body
    const user = req.user
    const { verifyPassowrd, hashPassword } = require('../../utilities/hashing&tokens')

    const pasQuery = `select password from users where user_id = $1`
    const storeNewPasQuery = `update users set password = $1 where user_id = $2`
    if (!current || current.trim() === '') {
        const err = new Error('Please provide Current Password')
        err.status = 401
        return next(err)
    }
    if (!newPas || newPas.trim() === '') {
        const err = new Error('Please provide the New Password')
        err.status = 401
        return next(err)
    }
    if (!confirm || confirm.trim() === '') {
        const err = new Error('Please provide the confirm Password')
        err.status = 401
        return next(err)
    }
    if (confirm !== newPas) {
        const err = new Error('Confirm Password does not match with new password')
        err.status = 401
        return next(err)
    }

    try {
        const response = await query(pasQuery, [user.user_id])
        const { password } = response.rows[0]
        const isVerified = await verifyPassowrd(current, password)
        if (isVerified) {
            const hashNewPassword = await hashPassword(newPas)
            const dbResponse = await query(storeNewPasQuery, [hashNewPassword, user.user_id])
            if (dbResponse.rowCount === 1) {
                res.status(201).json({ msg: 'Password Updated Successfully..' })
                return
            }
            return
        }

        const err = new Error('Invalid Password')
        err.status = 400
        return next(err)
    } catch (error) {
        return next(error)
    }

}
module.exports = { changePassword }