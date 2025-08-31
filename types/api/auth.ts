export interface User {
  phoneNumber: string;
  verified: boolean;
}

export interface OTPData {
  hashedOTP: string;
  attempts: number;
  requestedAt: number;
  expiresAt: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  error?: {
	code: string;
	message: string;
	details?: string;
  };
  retryAfter?: number; // in seconds
  expiresIn?: number; // in seconds
  attemptsLeft?: number; // for OTP verification
}

export interface TwilioResponse {
  success: boolean;
  sid?: string;
  error?: string;
}

export interface RequestOTPBody {
  phoneNumber: string;
}

export interface VerifyOTPBody {
  phoneNumber: string;
  otp: string;
}
