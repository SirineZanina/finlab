import bcrypt from 'bcryptjs';

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashOTP(otp: string): Promise<string> {
  return await bcrypt.hash(otp, 10);
}

export async function verifyOTP(otp: string, hashedOTP: string): Promise<boolean> {
  return await bcrypt.compare(otp, hashedOTP);
}

export function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}
