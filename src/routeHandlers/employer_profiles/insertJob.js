const { query } = require("../../database/db")
const customeErrorGenerator = (msg, stat = 500) => {
    const err = new Error(msg)
    err.status = stat
    return err
}
const postJob = async (req, res, next) => {
    const user = req.user
    const { title, description, requirements, responsibilities, location, is_remote, employment_type, salary_min, salary_max, status, application_deadline, company_id } = req.body
    const insertionQuery = `INSERT INTO
	JOBS_UPDATED (
		POSTED_BY_USER,
		TITLE,
		DESCRIPTION,
		REQUIREMENTS,
		LOCATION,
		EMPLOYMENT_TYPE,
		IS_REMOTE,
		SALARY_MIN,
		SALARY_MAX,
		STATUS,
		APPLICATION_DEADLINE,
		RESPONSIBILITIES,
		COMPANY_ID
	)
VALUES
	(
		$1,
		$2,
		$3,
		$4,
		$5,
		$6,
		$7,
		$8,
		$9,
		$10,
		$11,
		$12,
		$13
	)
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
    if (!parseInt(company_id)) {
        return next(customeErrorGenerator('Select Company for job posting', 400))
    }


    try {

        await query(insertionQuery, [user.user_id, title, description, requirements, location, employment_type, is_remote, salary_min, salary_max, status, application_deadline, responsibilities, company_id])
        res.status(201).json({ msg: "Job Added successfully" })
    } catch (error) {
        next(error)
    }
}
module.exports = { postJob }  