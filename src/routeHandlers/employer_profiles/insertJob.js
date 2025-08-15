const { query } = require("../../database/db")
const { getEmployeeID } = require('../../utilities/getEmployeeID')

const customeErrorGenerator = (msg, stat = 500) => {
    const err = new Error(msg)
    err.status = stat
    return err
}
const postJob = async (req, res, next) => {
    const user = req.user
    const { title, description, requirements, responsibilities, location, is_remote, employment_type, salary_min, salary_max, status, application_deadline } = req.body
    const insertionQuery = `insert into jobs(employer_id , title , description , requirements , location , employment_type , is_remote , salary_min , salary_max , status, application_deadline , responsibilities)
    values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `

    if (!title) {

        return next(customeErrorGenerator('job_title is required', 400))
    }
    if (!description) {

        return next(customeErrorGenerator('job_description is required', 400))
    } if (!requirements) {

        return next(customeErrorGenerator('job_requirments is required', 400))
    } if (!responsibilities) {

        return next(customeErrorGenerator('job_responsibilities are required', 400))
    } if (!location) {

        return next(customeErrorGenerator('job_location is required', 400))
    } if (!salary_min) {

        return next(customeErrorGenerator('job_min_salary is required', 400))
    } if (!salary_max) {

        return next(customeErrorGenerator('job_max_salary is required', 400))
    } if (!application_deadline) {

        return next(customeErrorGenerator('job_application_deadline is required', 400))
    }
    // get employee id first => done
    // add job with employee id
    try {
        const user_id = await getEmployeeID(user.user_id)
        if (user_id.length === 0) {
            const err = new Error('No profile found for employee , add employee_profile to proceed with this step...')
            err.status = 403
            return next(err)
        }
        if (user_id.length > 1) {
            const err = new Error('Something went wrong during fetching employee_profile')
            return next(err)
        }
        const { profile_id } = user_id[0]
        await query(insertionQuery, [profile_id, title, description, requirements, location, employment_type, is_remote, salary_min, salary_max, status, application_deadline, responsibilities])
        res.status(201).json({ msg: "Job Added successfully" })
    } catch (error) {
        next(error)
    }
}
module.exports = { postJob }  