const { query } = require("../database/db")

const tempErrorHandler = (error) => {
    const err = new Error(error)
    err.status = 400
    return err
}
const insertIntoCompanyEmployees = async (company_id, user_id) => {
    const insertionQuery = `INSERT INTO
	COMPANY_EMPLOYEES (COMPANY_ID, USER_ID, ROLE, VERIFIED_AT)
VALUES
	($1, $2, $3, NOW())`
    if (!company_id) {
        throw tempErrorHandler('Company id is required while adding record into company_employees')
    }
    if (!user_id) {
        throw tempErrorHandler('User id is required in this method')
    }

    try {
        const response = await query(insertionQuery, [company_id, user_id, 'HR'])
        if (response.rowCount === 1) {
            return true
        }
    } catch (error) {
        throw error
    }
}
module.exports = { insertIntoCompanyEmployees }