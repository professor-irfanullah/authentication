require('dotenv').config()
const sendGrid = require('@sendgrid/mail')
const sendEmail = async (to_email, verification_link) => {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY)
    try {
        const emailTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification - Job Connect</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; }
                    .footer { background-color: #f1f1f1; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; color: #666; }
                    .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .code { background: #eee; padding: 10px; border-radius: 4px; font-family: monospace; margin: 15px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Job Connect</h1>
                    </div>
                    <div class="content">
                        <h2>Verify Your Email Address</h2>
                        <p>Thank you for signing up for Job Connect! To complete your registration and start exploring job opportunities, please verify your email address.</p>
                        
                        <center>
                            <a href="${verification_link}" class="button">Verify Email Address</a>
                        </center>
                        
                        <p>Or copy and paste this link in your browser:</p>
                        <p class="code">${verification_link}</p>
                        
                        <p>This verification link will expire in 24 hours.</p>
                    </div>
                    <div class="footer">
                        <p>If you did not create an account with Job Connect, please ignore this email.</p>
                        <p>Need help? Contact our support team at <a href="mailto:khanprofessor1212@gmail.com">khanprofessor1212@gmail.com</a></p>
                        <p>&copy; ${new Date().getFullYear()} Job Connect. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        const msg = {
            to: to_email,
            from: process.env.adminEmail,
            subject: "Verify Your Email - Welcome to Job Connect",
            html: emailTemplate
        }
        await sendGrid.send(msg)
        return { msg: `An Email has been sent to this '${to_email}' please check your inbox and spam folders to verify`, success: true }
    } catch (error) {
        const errMsg = 'Field to send verification Email'
        return { success: false, message: errMsg }
    }
}
module.exports = { sendEmail }