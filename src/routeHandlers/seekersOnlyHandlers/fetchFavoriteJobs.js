const { query } = require("../../database/db")

const fetchFavoriteJobs = async (req, res, next) => {
    const user = req.user
    const insertionQuery = 'select * from favorite_jobs fj join jobs j on j.job_id = fj.job_id where fj.user_id = $1'
    try {
        const response = await query(insertionQuery, [user.user_id])
        res.status(200).json(response.rows)
    } catch (error) {
        next(error)
    }
}
module.exports = { fetchFavoriteJobs }