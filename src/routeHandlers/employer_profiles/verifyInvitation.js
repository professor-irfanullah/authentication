const { query } = require("../../database/db")
const { tokenVerification } = require("../../utilities/hashing&tokens")

const tempErrHandler = (msg, stat = 400) => {
    const err = new Error(msg)
    err.status = stat
    return err
}
const verifyInvite = async (req, res, next) => {
    const { token } = req.query
    const user = req.user
    const insertionQuery = `INSERT INTO
	COMPANY_EMPLOYEES
	(company_id, user_id,verified_at)
VALUES
	($1, $2,now())`
    if (!token) {
        return next(tempErrHandler('Invalid invitation status'))
    }
    try {

        const isValidToken = tokenVerification(token)
        await query(insertionQuery, [isValidToken.companyId, isValidToken.user_id])
        res.status(201).json('Created')

    } catch (error) {

        if (error.message === 'jwt expired') {
            return next(tempErrHandler('Session Expired', 400))
        }
        if (error.constraint === 'unique_c_record') {
            return next(tempErrHandler('Already verified', 500))
        }
        res.status(500).json({ err: "Something went wrong while verifying the invitation" })
    }
}
module.exports = { verifyInvite }