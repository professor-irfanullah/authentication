const { query } = require("../../database/db")

const updateData = async (req, res, next) => {
    const user = req.user
    const { profile } = req.body
    const { name, visibility } = profile
    const updateNameQuery = `update users set name = $1 , updated_at = now() , is_public = $2 where user_id = $3 `

    if (!name || name.trim() === '') {
        const err = new Error('Please provide name a value')
        err.status = 400
        return next(err)
    }

    try {
        const response = await query(updateNameQuery, [name, visibility, user.user_id])
        // const visibilityStatusResponse = await query(update_Is_privateQuery, [visibility, user.user_id])
        if (response.rowCount === 1) {
            res.status(201).json({ msg: 'Passsword and visibility Updated Successfully' })
            return
        }

    } catch (error) {
        return next(error)
    }
}
module.exports = { updateData }