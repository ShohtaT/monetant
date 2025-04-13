import { Resend } from 'resend';

// 環境変数のチェック
if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export const sendEmail = async (payload: EmailPayload) => {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
      react: undefined,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
