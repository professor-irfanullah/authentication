const { query } = require("../../database/db")

const tempErrorHandler = (msg, stat = 400) => {
    const err = new Error(msg)
    err.status = stat
    return err
}
const deleteTechnologyFromCompany = async (req, res, next) => {
    const { techID, company_id } = req.query
    const user = req.user
    if (!parseInt(techID)) {
        return next(tempErrorHandler('Missing argument'))
    }
    if (!parseInt(company_id)) {
        return next(tempErrorHandler('Missing argument'))
    }
    // chk if the user is hr 
    const chk_HR_query = `select role from company_employees where company_id = $1 and user_id = $2`
    const deleteQuery = `delete from technologies where technology_id = $1`

    try {
        const role = await query(chk_HR_query, [company_id, user.user_id])

        if (role.rows[0].role !== 'HR') {
            return next(tempErrorHandler('Unauthorized', 401))
        }

        await query(deleteQuery, [techID])
        res.status(200).json({ msg: 'Technology Removed' })
    } catch (error) {
        console.log(error);

        next(tempErrorHandler('something went wrong', 500))
    }
}
module.exports = { deleteTechnologyFromCompany }