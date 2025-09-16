const { query } = require("../../database/db")

const deleteJob = async (req, res, next) => {
    const deleting_query = `delete from jobs_updated where job_id = $1`
    const { job_id } = req.query
    if (!parseInt(job_id)) {
        const err = new Error('job_id is required')
        err.status = 400
        return next(err)
    }

    try {
        const response = await query(deleting_query, [job_id])
        if (response.rowCount === 1) {
            return res.status(200).json({ msg: 'Job Removed successfully' })
        }
        res.status(404).json({ err: 'Job not found..' })
    } catch (error) {
        next(error)
    }
}

module.exports = { deleteJob }