const { query } = require("../database/db")

const getEmployeeID = async (user_id) => {
    const employeeIdQuery = `SELECT ep.profile_id
FROM employer_profiles ep
WHERE ep.user_id = $1
;
`
    if (!user_id) {
        throw new Error('Please provide an user_id')
    }

    try {
        const response = await query(employeeIdQuery, [user_id])
        return response.rows
    } catch (error) {
        throw error
    }
}
module.exports = { getEmployeeID } 