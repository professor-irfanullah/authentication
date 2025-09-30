const { query } = require("../database/db")

const getCompanyId = async (name) => {
    const insertionQuery = `SELECT
	COMPANY_ID
FROM
	COMPANY
WHERE
	NAME = $1`
    if (!name) {
        const err = new Error('Company is missing in getEmployeeID')
        err.status = 400
        throw err
    }

    try {
        const response = await query(insertionQuery, [name])
        if (response.rows.length) {
            return response.rows[0]
        }
        const err = new Error('Company Not Found')
        err.status = 404
        throw err
    } catch (error) {
        throw error
    }
}
module.exports = { getCompanyId }