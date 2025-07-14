const { query } = require("../../database/db")

const updateData = async (req, res, next) => {
    const user = req.user
    const { profile } = req.body
    const { name, visibility } = profile
    const updateNameQuery = `update users set name = $1 , updated_at = now() where user_id = $2 `
    const update_Is_privateQuery = `update seeker_profiles set is_public = $1 where user_id = $2`

    if (!name || name.trim() === '') {
        const err = new Error('Please provide name a value')
        err.status = 400
        return next(err)
    }

    try {
        const response = await query(updateNameQuery, [name, user.user_id])
        const visibilityStatusResponse = await query(update_Is_privateQuery, [visibility, user.user_id])
        if (response.rowCount === 1 && visibilityStatusResponse.rowCount === 1) {
            res.status(201).json({ msg: 'Updated Successfully' })
            return
        }

    } catch (error) {
        return next(error)
    }
}
module.exports = { updateData }