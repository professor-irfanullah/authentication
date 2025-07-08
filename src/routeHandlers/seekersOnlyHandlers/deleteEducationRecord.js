const { query } = require("../../database/db")

const deleteEduRecord = async (req, res, next) => {
    const user = req.user
    const deleteQuery = `delete from seeker_education where education_id = $1 and user_id = $2`
    const { education_id } = req.query
    if (!parseInt(education_id)) {
        const err = new Error('Please provide a valid education_id')
        err.status = 400
        return next(err)
    }
    try {
        const response = await query(deleteQuery, [education_id, user.user_id])
        if (response.rowCount === 1) {
            res.status(200).json({ msg: 'Operation Successfull..' })
        }
        else {
            return res.status(404).json({ msg: 'ID not found error..' })
        }
    }
    catch (err) {
        return next(err)
    }
}
module.exports = { deleteEduRecord }