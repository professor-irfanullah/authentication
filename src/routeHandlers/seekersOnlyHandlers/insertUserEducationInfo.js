const { query } = require("../../database/db")

const insertSeekerEducationInfo = async (req, res, next) => {
    const { institution, degree, field_of_study, start_date, end_date } = req.body
    const user = req.user

    const insertionQuery = `insert into seeker_education(user_id , institution , degree , field_of_study , start_date , end_date ) values($1,$2,$3,$4 , $5, $6) on conflict(institution , user_id)  do update
set 
INSTITUTION = excluded.INSTITUTION,
DEGREE = excluded.DEGREE,
FIELD_OF_STUDY = excluded.FIELD_OF_STUDY,
START_DATE = excluded.START_DATE,
END_DATE = excluded.END_DATE
`
    if (!institution) {
        const err = new Error('Please provide institution name')
        err.status = 400
        return next(err)
    }
    if (!degree) {
        const err = new Error('Please provide valid degree information')
        err.status = 400
        return next(err)
    } if (!field_of_study) {
        const err = new Error('Please provide valid field_of_study information')
        err.status = 400
        return next(err)
    }
    if (!start_date) {
        const err = new Error('Please provide start date information')
        err.status = 400
        return next(err)
    }
    if (!end_date) {
        const err = new Error('Please provide end date information')
        err.status = 400
        return next(err)
    }

    try {
        const response = await query(insertionQuery, [user.user_id, institution, degree, field_of_study, start_date, end_date])
        if (response.rowCount >= 1) {
            res.status(201).json({ msg: 'Records saved successfully..' })
        }

    } catch (error) {
        return next(error)
    }

}
module.exports = { insertSeekerEducationInfo }