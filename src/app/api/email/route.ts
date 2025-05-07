import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { EmailTemplate } from '@/components/common/email/emailTemplate';

const resend = new Resend('re_W61NTfGt_LQpHmHQPVurNCscaMiLhJb8V');

// @see https://resend.com/docs/send-with-nextjs#3-send-email-using-react
export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "shohta.tak22@gmail.com",
      to: ['shohh6119@gmail.com'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
