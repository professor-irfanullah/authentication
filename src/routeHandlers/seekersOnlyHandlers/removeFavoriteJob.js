const { query } = require("../../database/db")

const removeSavedJob = async (req, res, next) => {
    const { job_id } = req.query
    const user = req.user
    const insertionQuery = 'delete from favorite_jobs where job_id = $1 and user_id = $2'
    if (!job_id) {
        const err = new Error('Please provide a valid job_id')
        err.status = 400
        return next(err)
    }

    try {
        const response = await query(insertionQuery, [job_id, user.user_id])
        if (response.rowCount === 1) {
            res.status(200).json({ msg: "Job Removed from favorite List.." })
        }
        else {
            const err = new Error("Job does not exists in the list...")
            err.statu = 404
            return next(err)
        }
    } catch (error) {
        next(error)
    }
}
module.exports = { removeSavedJob }