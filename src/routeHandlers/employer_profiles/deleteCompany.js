const { query } = require("../../database/db")

const deleteCompany = async (req, res, next) => {
    const { company_id } = req.query
    const deleteQuery = `delete from company where company_id = $1 `
    if (!parseInt(company_id)) {
        const err = new Error('Invalid companyID')
        err.status = 400
        return next(err)
    }

    try {
        const response = await query(deleteQuery, [company_id])
        if (response.rowCount >= 1) {
            return res.status(200).json({ msg: "Operation Successfull" })
        }
        res.status(200).send(response.rowCount)
    } catch (error) {
        res.status(500).json({ err: error })
    }
}
module.exports = { deleteCompany }