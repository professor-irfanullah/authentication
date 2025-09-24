const { query } = require("../../database/db")

const fetchFavoriteJobs = async (req, res, next) => {
    const user = req.user
    const insertionQuery = `
    SELECT
	*
FROM
	FAVORITE_JOBS FJ
		JOIN JOBS_UPDATED J ON J.JOB_ID = FJ.JOB_ID
		JOIN COMPANY C ON C.COMPANY_ID = J.COMPANY_ID
WHERE
	FJ.USER_ID = $1
    `
    try {
        const response = await query(insertionQuery, [user.user_id])
        res.status(200).json(response.rows)
    } catch (error) {
        next(error)
    }
}
module.exports = { fetchFavoriteJobs }