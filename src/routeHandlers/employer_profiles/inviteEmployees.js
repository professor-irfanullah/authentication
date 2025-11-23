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
            `SELECT u.name as HR_name, c.name as company_name,c.company_id,u.email,c.address,ce.role FROM company_employees ce 
left join company c on c.company_id = ce.company_id
left join users u on u.user_id = ce.user_id
where u.user_id = $1 and c.company_id = $2`,
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
        const data = response.rows[0]
        req.data = { data, name, new_emp_role, user_id, email }
        await sendInvitationEmail(req, res, next)
    } catch (error) {
        console.error("Invite Employees Error:", error);
        return res.status(500).json({ msg: "Something went wrong" });
    }
};

module.exports = { inviteEmployees };
