import emailjs from 'emailjs-com';

const SERVICE_ID = import.meta.env.VITE_EMAIL_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAIL_TEMPLATEID;
const USER_ID = import.meta.env.VITE_EMAIL_USER_ID;

export const sendResetPasswordEmail = async ( recipientEmail: string, resetPassLink: string, Name: string
) => {
  try {
    const templateParams = {
      to_email: recipientEmail,
      reset_link: resetPassLink,
      users_name: Name,
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      USER_ID
    );

    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};