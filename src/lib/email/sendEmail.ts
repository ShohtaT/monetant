export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  try {
    const response = await fetch('/api/v1/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('メール送信に失敗しました');
    }
  } catch (error) {
    console.error('メール送信エラー:', error);
    throw error;
  }
}
