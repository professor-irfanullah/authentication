const { query } = require("../../database/db")

const allJobs = async (req, res, next) => {
    const jobFetchQuery = `select * from jobs`

    try {
        const response = await query(jobFetchQuery)
        res.status(200).json({ jobs: response.rows })
    } catch (error) {
        next(error)
    }
}
module.exports = { allJobs }