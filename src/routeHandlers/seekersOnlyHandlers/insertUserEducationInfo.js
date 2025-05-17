const { query } = require("../../database/db")

const insertSeekerEducationInfo = async (req, res, next) => {
    const insertionQuery = `insert into seeker_education(user_id , institution , degree , field_of_study , start_date , end_date ) values($1,$2,$3,$4 , $5, $6)`
    const checkQuery = `select education_id from seeker_education where user_id = $1`
    const updationQuery = `update seeker_education set institution = $1 , degree = $2 , field_of_study = $3 , start_date = $4 , end_date = $5  where user_id = $6`

    const { institution, degree, field_of_study, start_date, end_date } = req.body
    const user = req.user

    if (!institution || !degree || !field_of_study || !start_date || !end_date) {
        const err = new Error('All fields are required!')
        err.status = 400
        return next(err)
    }

    try {
        const checkDbResponse = await query(checkQuery, [user.user_id])
        if (checkDbResponse.rows.length) {
            const updateDbResponse = await query(updationQuery, [institution, degree, field_of_study, start_date, end_date, user.user_id])
            if (updateDbResponse.rowCount === 1) {
                return res.status(201).json({ msg: 'Updation successfull' })
            }
        }
        const insertionResponse = await query(insertionQuery, [user.user_id, institution, degree, field_of_study, start_date, end_date])
        if (insertionResponse.rowCount === 1) {
            return res.status(201).json({ msg: 'Operation successfull' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
module.exports = { insertSeekerEducationInfo }