require("dotenv").config();
const { query } = require("../database/db");
const {
    createToken,
    tokenVerification,
} = require("../utilities/hashing&tokens");
const { sendEmail } = require("./sendGridVerificationEmail");
const sendInvitationEmail = async (req, res, next) => {
    const data = req.data;
    // generate a token
    const token = createToken(data);
    const link = `${req.protocol}://${req.get(
        "host"
    )}/api/employee/accept/invitation?token=${token}`;
    let company = null;
    try {
        // fetch company name here
        const companyName = await query(
            `
            SELECT
	        NAME
            FROM
	        COMPANY_EMPLOYEES CE JOIN COMPANY C ON CE.COMPANY_ID = C.COMPANY_ID
            WHERE
	        C.COMPANY_ID = $1
            `,
            [data.companyId]
        );
        // and store it into the users's verification token
        // and then generate a link and send it inside email to the client email account
        await query(
            `update users set verification_token = $1, updated_at = now() where user_id = $2`,
            [token, data.user_id]
        );
        company = companyName.rows[0];
        // now send email to the employee
        const subject = "Confirm Email Address";
        const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invitation Email</title>
  </head>
  <body>
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        color: #333;
      "
    >
      <h2 style="color: #2c3e50">Welcome to ${company.name}!</h2>
      <p>Dear ${data.name},</p>
      <p>
        We are excited to have you as part of our team at ${company.name}. To
        finalize your registration and join the company network, please verify
        your email address.
      </p>
      <p style="margin: 20px 0">
        <a
          href="${link}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background-color: #4f46e5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          "
        >
          ${subject}
        </a>
      </p>
      <p>
        If you did not request this verification or if this was sent in error,
        please contact HR immediately at ${process.env.adminEmail}.
      </p>
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee" />
      <p style="font-size: 12px; color: #888">
        Need assistance? Reach out to HR at ${process.env.adminEmail}
      </p>
    </div>
  </body>
</html>
`;
        const response = await sendEmail(data.email, link, template, subject);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json("Something went wrong");
    }

    // console.log(user_id, email, companyId);
};
module.exports = { sendInvitationEmail };
