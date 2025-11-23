require('dotenv').config();
const Brevo = require('@getbrevo/brevo');

const sendEmail = async (
    to_email,
    verification_link,
    templateId = 1 // Use Brevo template ID
) => {
    if (!to_email) throw new Error("Email is required");
    if (!verification_link) throw new Error("Verification link is missing");

    // Initialize the Brevo API client
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const sender = { email: process.env.adminEmail, name: "Job Connect" };
    const receivers = [{ email: to_email }];

    // Using a pre-saved template
    const sendSmtpEmail = {
        sender,
        to: receivers,
        templateId, // Pass the template ID instead of htmlContent
        params: {
            verification_link,
            username: to_email.split('@')[0] // Example param for your template
        },
    };

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        return { msg: "Email was sent successfully", success: true };
    } catch (error) {
        console.error("Brevo error:", error.response?.body || error);
        throw error;
    }
};

const sendCompanyInvitationEmail = async (obj, link, templateId = 2) => {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const sender = { email: process.env.adminEmail, name: "Job Connect" };
    const receivers = [{ email: obj.email }];
    const sendSmtpEmail = {
        sender,
        to: receivers,
        templateId, // Pass the template ID instead of htmlContent
        params: {
            company_name: obj.data.company_name,
            employee_name: obj.name,
            job_title: obj.new_emp_role,
            start_date: new Date().toISOString().split('T'[0])[0],
            onboarding_portal_link: link,
            hr_contact_email: obj.data.email,
            hr_contact_phone: obj.data.email
        },
    };
    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail)
        return { msg: "Email was sent successfully", success: true }
    } catch (error) {
        console.error("Brevo error:", error.response?.body || error);
        throw error
    }








    // console.log(obj.data.company_name, obj.name, obj.new_emp_role, new Date().toISOString().split('T'[0])[0], link, obj.data.email);
    return obj
    // return params
    // employee_name,company_name,verification_token,hr_contact_email,hr_contact_number,company_address,current_year {
    // 	"data": {
    // 		"hr_name": "Professor Irfan Ullah",
    // 		"company_name": "IT solutions",
    // 		"email": "irfanprofessoredited60@gmail.com",
    // 		"address": "Nawagai Swat",
    // 		"role": "HR"
    // 	},
    // 	"name": "Irfan",
    // 	"new_emp_role": "employee",
    // 	"user_id": 45,
    // 	"email": "irfanprofessor60@gmail.com"
    // }
}

module.exports = { sendEmail, sendCompanyInvitationEmail };
