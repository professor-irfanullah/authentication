const { query } = require("../../database/db");
const { sendInvitationEmail } = require('../../sendGrid/sendInvitationEmail')
const customError = (msg, stat = 400) => {
    const err = new Error(msg);
    err.status = stat;
    return err;
};

const inviteEmployees = async (req, res, next) => {
    const user = req.user;
    const { email, company_id } = req.body;

    const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;

    // Input validation
    const companyId = parseInt(company_id);
    if (!email || !companyId) {
        return next(customError('Invalid inputs', 400));
    }

    if (!emailRegex.test(email)) {
        return next(customError('Invalid Gmail address format', 400));
    }

    try {
        // Check if the requesting user is an HR at the specified company
        const response = await query(
            `SELECT role FROM company_employees WHERE user_id = $1 AND company_id = $2`,
            [user.user_id, companyId]
        );

        if (response.rows.length === 0) {
            return next(customError('User is not associated with this company', 403));
        }

        const { role } = response.rows[0];

        if (role !== "HR") {
            return next(customError('Insufficient access - HR role required', 403));
        }

        // Check if the employee to be invited exists
        const resp = await query(
            `SELECT user_id,name ,role AS new_emp_role FROM users WHERE email = $1`,
            [email]
        );

        if (resp.rows.length === 0) {
            return next(customError('Employee does not exist', 404));
        }

        const { new_emp_role, name, user_id } = resp.rows[0];

        if (new_emp_role === 'seeker') {
            return next(customError('Cannot invite users with seeker role', 403));
        }
        req.data = { user_id, email, companyId, name }
        // Successful invitation eligibility
        // now lets integrate db 
        // const dbResponse = await query(`insert into company_employees(company_id,user_id) values($1,$2)`, [companyId, user_id])
        // return res.status(200).json({ msg: "Operation Successfull" });
        await sendInvitationEmail(req, res, next)

    } catch (error) {
        console.error("Invite Employees Error:", error);
        return res.status(500).json({ msg: "Something went wrong" });
    }
};

module.exports = { inviteEmployees };
