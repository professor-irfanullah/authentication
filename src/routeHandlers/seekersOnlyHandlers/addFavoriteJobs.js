const { query } = require("../../database/db")

const addToFavoriteJobs = async (req, res, next) => {
    const user = req.user
    const { job_id } = req.body
    const insertionQuery = `insert into favorite_jobs(job_id , user_id)
    values($1 , $2)`

    try {
        const response = await query(insertionQuery, [job_id, user.user_id])
        if (response.rowCount === 1) {
            return res.status(201).json({ msg: "Job Added to favorite_jobs" })
        }
    } catch (error) {
        if (error.constraint === 'uniquerec') {
            const err = new Error('Job already exists!')
            err.status = 403
            return next(err)
        }
        next(error)
    }
}
module.exports = { addToFavoriteJobs }