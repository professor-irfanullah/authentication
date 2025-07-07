const { query } = require("../../database/db")

const insertSeekerSkillRecord = async (req, res, next) => {
    const { skill_name, proficiency_level, years_of_experience } = req.body
    const user = req.user
    const insertQuery = `insert into seeker_skills(skill_name,proficiency_level , user_id , years_of_experience) values($1,$2,$3 , $4)`

    if (!skill_name) {
        const err = new Error('Skill name is required required!')
        err.status = 400
        return next(err)
    }
    if (!proficiency_level) {
        const err = new Error('Proficiency level is required!')
        err.status = 400
        return next(err)
    }
    if (!years_of_experience) {
        const err = new Error('Years_of_experience is required!')
        err.status = 400
        return next(err)
    }

    try {
        const response = await query(insertQuery, [skill_name, proficiency_level, user.user_id, years_of_experience])
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