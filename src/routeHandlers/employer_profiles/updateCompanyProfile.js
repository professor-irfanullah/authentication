const { query } = require("../../database/db");

const updateCompanyProfile = async (req, res, next) => {
    const { name, description, company_size, address, industry, company_id } = req.body;
    const updateQuery = `UPDATE COMPANY
    SET DESCRIPTION = $1,
    COMPANY_SIZE = $2,
    INDUSTRY = $3,
    ADDRESS = $4,
    NAME = $5
    WHERE
    	COMPANY_ID = $6`


    if (!name) {
        const err = new Error('Company Name is required')
        err.status = 400
        return next(err)
    }
    if (!description) {
        const err = new Error('Company description is required')
        err.status = 400
        return next(err)
    }
    if (!company_size) {
        const err = new Error('Company company_size is required')
        err.status = 400
        return next(err)
    }
    if (!industry) {
        const err = new Error('Company industry is required')
        err.status = 400
        return next(err)
    }
    if (!address) {
        const err = new Error('Company Address is required')
        err.status = 400
        return next(err)
    }
    if (!parseInt(company_id)) {
        const err = new Error('Company company_id is required')
        err.status = 400
        return next(err)

    }
    try {
        await query(updateQuery, [description, company_size, industry, address, name, company_id])
        res.status(200).json({ msg: "Operation Successfull" })
    } catch (error) {
        res.status(500).json(error)
    }

}


module.exports = { updateCompanyProfile }