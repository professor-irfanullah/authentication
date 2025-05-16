const { query } = require("../../database/db")

const insertSeekerEducationInfo = async (req, res, next) => {
    const insertionQuery = `insert into seeker_education(user_id , institution , degree , field_of_study ) values($1,$2,$3,$4)`
    const checkQuery = `select education_id from seeker_education where user_id = $1`
    const updationQuery = `update seeker_education set institution = $1 , degree = $2 , field_of_study = $3  where user_id = $4`

    const { institution, degree, field_of_study } = req.body
    const user = req.user

    if (!institution || !degree || !field_of_study) {
        const err = new Error('All fields are required!')
        err.status = 400
        return next(err)
    }

    try {
        const checkDbResponse = await query(checkQuery, [user.user_id])
        if (checkDbResponse.rows.length) {
            const updateDbResponse = await query(updationQuery, [institution, degree, field_of_study, user.user_id])
            if (updateDbResponse.rowCount === 1) {
                return res.status(201).json({ msg: 'Updation successfull' })
            }
        }
        const insertionResponse = await query(insertionQuery, [user.user_id, institution, degree, field_of_study])
        if (insertionResponse.rowCount === 1) {
            return res.status(201).json({ msg: 'Operation successfull' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
module.exports = { insertSeekerEducationInfo }