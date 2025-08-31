import jwt from 'jsonwebtoken';
import { User } from '@/types/client/entities';
import { OTPData } from '@/types/api/auth';

export function generateToken(payload: Partial<User>): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as User;
  } catch (error) {
    return null;
  }
}

// Simple in-memory store (use Redis/Database in production)
const otpStore = new Map<string, OTPData>();

export const otpService = {
  store: (phoneNumber: string, data: Omit<OTPData, 'expiresAt'>) => {
    otpStore.set(phoneNumber, {
      ...data,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });
  },

  get: (phoneNumber: string): OTPData | null => {
    const data = otpStore.get(phoneNumber);
    if (!data || Date.now() > data.expiresAt) {
      otpStore.delete(phoneNumber);
      return null;
    }
    return data;
  },

  delete: (phoneNumber: string): void => {
    otpStore.delete(phoneNumber);
  },

  incrementAttempts: (phoneNumber: string): void => {
    const data = otpStore.get(phoneNumber);
    if (data) {
      otpStore.set(phoneNumber, {
        ...data,
        attempts: (data.attempts || 0) + 1
      });
    }
  }
};
