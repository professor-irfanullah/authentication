const submitJobApplication = async (req, res, next) => {
    const { query } = require('../../database/db')
    const user = req.user
    const { job_id, cover_letter } = req.body
    const insertionQuery = `insert into applications(job_id , user_id , cover_letter) values($1,$2,$3)`
    if (!job_id) {
        const err = new Error('Please Provide a valid job ID')
        err.status = 400
        return next(err)
    }
    if (!cover_letter) {
        const err = new Error('Please Provide cover_letter value')
        err.status = 400
        return next(err)
    }

    try {
        const response = await query(insertionQuery, [job_id, user.user_id, cover_letter])
        if (response.rowCount === 1) {

            return res.status(201).json({ msg: 'Application submitted successfully..' })
        }
    } catch (error) {
        if (error.constraint == 'chk_duplicate') {
            const err = new Error('Application already exists for this job')
            err.status = 403
            return next(err)
        }

        return next(error)
    }
}
module.exports = { submitJobApplication } 