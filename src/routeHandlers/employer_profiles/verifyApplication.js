const { query } = require('../../database/db')
const verifyApplication = async (req, res, next) => {
    const { application_status, application_id } = req.body
    const insertionQuery = `update applications set application_status = $1 where application_id = $2`
    if (!parseInt(application_id)) {
        const err = new Error("Application_id is required...")
        err.status = 400
        return next(err)
    }
    if (!application_status) {
        const err = new Error("Application_status is required...")
        err.status = 400
        return next(err)
    }
    try {
        const response = await query(insertionQuery, [application_status, application_id])
        if (response.rowCount === 1) {
            res.status(200).json({ msg: "Operation successful..." })
        }
        return
    } catch (error) {
        next(error)
    }
}
module.exports = { verifyApplication }