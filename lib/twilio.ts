import { TwilioResponse } from '@/types/api/auth';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendSMS(to: string, message: string): Promise<TwilioResponse> {
  try {
    // Using Twilio Verify Service (no custom message, Twilio generates the OTP)
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications
      .create({
        to: to, // +21651906020 format
        channel: 'sms'
      });

    console.log('Verification sent successfully:', verification.sid);
    return { success: true, sid: verification.sid };
  } catch (error: any) {
    console.error('Twilio Verify error:', error);
    return { success: false, error: error.message };
  }
}
