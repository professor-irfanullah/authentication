const { query } = require("../../database/db")

const insertSeekerSkillRecord = async (req, res, next) => {
    const { skill_name, proficiency_level } = req.body
    const user = req.user
    const insertQuery = `insert into seeker_skills(skill_name,proficiency_level , user_id) values($1,$2,$3)`

    if (!skill_name || !proficiency_level) {
        const err = new Error('All fields are required!')
        err.status = 400
        return next(err)
    }

    try {
        const response = await query(insertQuery, [skill_name, proficiency_level, user.user_id])
        if (response.rowCount === 1) {
            return res.status(201).json({ msg: "operation successful" })
        }

    } catch (error) {
        if (error.code == '22P02') {
            const err = new Error(`proficiency_level supports only 'beginner', 'intermediate', and 'expert'.`)
            err.status = 400
            return next(err)
        }
        res.status(500).json(error)
    }
}
module.exports = { insertSeekerSkillRecord }