import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

export interface EmailParams {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  [key: string]: string | number;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS configuration missing');
      return false;
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      params,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Email templates for different scenarios
export const emailTemplates = {
  welcome: (name: string, email: string) => ({
    to_email: email,
    to_name: name,
    subject: 'Welcome to MANTECH Nexus',
    message: `Dear ${name},\n\nWelcome to MANTECH Nexus! Your account has been successfully created.\n\nYou can now access our enterprise internship management platform.\n\nBest regards,\nMANTECH Nexus Team`,
  }),

  applicationReceived: (name: string, email: string, companyName: string) => ({
    to_email: email,
    to_name: name,
    subject: 'Application Received',
    message: `Dear ${name},\n\nYour application to ${companyName} has been received successfully.\n\nYou can track your application status in your dashboard.\n\nBest regards,\nMANTECH Nexus Team`,
  }),

  interviewScheduled: (name: string, email: string, companyName: string, date: string) => ({
    to_email: email,
    to_name: name,
    subject: 'Interview Scheduled',
    message: `Dear ${name},\n\nYou have been selected for an interview with ${companyName}.\n\nDate: ${date}\n\nPlease check your dashboard for more details.\n\nBest regards,\nMANTECH Nexus Team`,
  }),

  placementConfirmed: (name: string, email: string, companyName: string) => ({
    to_email: email,
    to_name: name,
    subject: 'Internship Placement Confirmed',
    message: `Dear ${name},\n\nCongratulations! Your internship placement with ${companyName} has been confirmed.\n\nPlease complete the onboarding process in your dashboard.\n\nBest regards,\nMANTECH Nexus Team`,
  }),

  reportReminder: (name: string, email: string, weekNumber: number) => ({
    to_email: email,
    to_name: name,
    subject: 'Weekly Report Reminder',
    message: `Dear ${name},\n\nThis is a reminder to submit your weekly report for Week ${weekNumber}.\n\nPlease log in to your dashboard to submit your report.\n\nBest regards,\nMANTECH Nexus Team`,
  }),
};
