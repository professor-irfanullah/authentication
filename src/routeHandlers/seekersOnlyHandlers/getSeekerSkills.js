const { query } = require("../../database/db")

const getSeekerSkills = async (req, res, next) => {
    const user = req.user
    const getQuery = `select skill_id , skill_name , proficiency_level , years_of_experience from seeker_skills where user_id = $1`
    try {
        const response = await query(getQuery, [user.user_id])
        res.json({ data: response.rows })
    }
    catch (err) {
        console.log(err);
        next(err)

    }
}
module.exports = { getSeekerSkills }