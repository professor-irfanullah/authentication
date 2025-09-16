const { query } = require("../../database/db")
const customeErrorGenerator = (msg, stat = 500) => {
    const err = new Error(msg)
    err.status = stat
    return err
}
const updateJob = async (req, res, next) => {
    const { title, description, requirements, responsibilities, location, is_remote, employement_type, salary_min, salary_max, application_deadline, status, job_id } = req.body
    const user = req.user
    const updation_query = `UPDATE JOBS_UPDATED SET title = $1 , description = $2 , requirements = $3 , location = $4 , employment_type = $5 , is_remote = $6 , salary_min = $7 , salary_max = $8 , status = $9 , application_deadline = $10 , responsibilities = $11
WHERE job_id = $12 AND posted_by_user = $13`
    if (!title) {
        return next(customeErrorGenerator('Title filed is required', 400))
    }
    if (!description) {
        return next(customeErrorGenerator('description field is required', 400))
    } if (!title) {
        return customeErrorGenerator('Title filedis required')
    } if (!requirements) {
        return next(customeErrorGenerator('job requirements field is required', 400))
    } if (!salary_max) {
        return next(customeErrorGenerator('salary max field is required', 400))
    } if (!salary_min) {
        return next(customeErrorGenerator('salary min field is required', 400))
    } if (!status) {
        return next(customeErrorGenerator('status field is required', 400))
    } if (!application_deadline) {
        return next(customeErrorGenerator(' application deadline field is required', 400))
    } if (!responsibilities) {
        return next(customeErrorGenerator('responsibilities filed field is required', 400))
    } if (!salary_min) {
        return next(customeErrorGenerator('salary min field is required', 400))
    }
    if (!parseInt(job_id)) {
        return next(customeErrorGenerator('job_id field is required', 400))
    }

    try {
        await query(updation_query, [title, description, requirements, location, employement_type, is_remote, salary_min, salary_max, status, application_deadline, responsibilities, job_id, user.user_id])
        res.status(201).json({ msg: "Operation successfull.." })

    } catch (error) {
        next(error)
    }
}
module.exports = { updateJob } 