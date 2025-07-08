const { query } = require("../../database/db")

const getSeekerEducation = async (req, res, next) => {
    const user = req.user
    const getEduQuery = `select education_id , institution , degree , field_of_study , start_date , end_date from seeker_education where user_id = $1`

    try {
        const response = await query(getEduQuery, [user.user_id])
        res.status(200).json({ data: response.rows })
    } catch (error) {
        next(error)
    }
}
module.exports = { getSeekerEducation }