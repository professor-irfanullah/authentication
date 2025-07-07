const { query } = require('../../database/db')
const deleteSeekerSkillRecord = async (req, res, next) => {
    const { skill_id } = req.query
    const user = req.user
    const deleteQuery = `delete from seeker_skills where user_id = $1 and skill_id = $2`
    if (!skill_id) {
        const err = new Error('please provide a valid parameter!')
        err.status = 400
        return next(err)
    }
    try {
        const response = await query(deleteQuery, [user.user_id, skill_id])
        if (response.rowCount === 1) {
            return res.status(200).json({ msg: "Operation successful" })
        }
        const err = new Error('looks like the record does not exists! please refresh the page and continue')
        return next(err)

    } catch (error) {
        res.status(500).json(error)
    }
}
module.exports = { deleteSeekerSkillRecord }