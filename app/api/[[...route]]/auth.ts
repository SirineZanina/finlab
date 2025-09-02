import { generateToken, otpService } from '@/lib/auth';
import { withSession } from '@/lib/middleware';
import { generateOTP, hashOTP, validatePhoneNumber, verifyOTP } from '@/lib/otp';
import { sendSMS } from '@/lib/twilio';
import { getUserFromSession } from '@/app/(auth)/_lib/utils/session/session';
import { AuthResponse, RequestOTPBody, User, UserRolesResponse, VerifyOTPBody } from '@/types/api/auth';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { prisma } from '@/lib/prisma';

export const authRouter = new Hono<{
  Variables: {
	user?: User;
  }
}>()

// Request OTP Route
//   .post('/request-otp', async (c) => {
//     try {
// 	  const body: RequestOTPBody = await c.req.json();
// 	  const { phoneNumber } = body;

// 	  // Validate phone number format
// 	  if (!validatePhoneNumber(phoneNumber)) {
//         const errorResponse: AuthResponse = {
// 		  success: false,
// 		  error: {
//             code: 'INVALID_PHONE_FORMAT',
//             message: 'Invalid phone number format'
// 		  }
//         };
//         return c.json(errorResponse, 400);
// 	  }

// 	  // Rate limiting check
// 	  const existingOTP = otpService.get(phoneNumber);
// 	  if (existingOTP && Date.now() - (existingOTP.requestedAt || 0) < 60000) {
//         const errorResponse: AuthResponse = {
// 		  success: false,
// 		  error: {
//             code: 'RATE_LIMITED',
//             message: 'Please wait before requesting another OTP'
// 		  },
// 		  retryAfter: 60 - Math.floor((Date.now() - existingOTP.requestedAt) / 1000)
//         };
//         return c.json(errorResponse, 429);
// 	  }

// 	  const otp = generateOTP();
// 	  const hashedOTP = await hashOTP(otp);

// 	  // Store OTP
// 	  otpService.store(phoneNumber, {
//         hashedOTP,
//         attempts: 0,
//         requestedAt: Date.now()
// 	  });

// 	  // Send SMS
// 	  const result = await sendSMS(phoneNumber, `Your verification code is: ${otp}`);

// 	  if (!result.success) {
//         const errorResponse: AuthResponse = {
// 		  success: false,
// 		  error: {
//             code: 'SMS_SEND_FAILED',
//             message: 'Failed to send OTP',
//             details: result.error
// 		  }
//         };
//         return c.json(errorResponse, 500);
// 	  }

// 	  const successResponse: AuthResponse = {
//         success: true,
//         message: 'OTP sent successfully',
//         expiresIn: 300
// 	  };
// 	  return c.json(successResponse, 200);

//     } catch (error) {
// 	  console.error('Request OTP error:', error);
// 	  const errorResponse: AuthResponse = {
//         success: false,
//         error: {
// 		  code: 'INTERNAL_SERVER_ERROR',
// 		  message: 'Internal server error',
// 		  details: error instanceof Error ? error.message : 'Unknown error'
//         }
// 	  };
// 	  return c.json(errorResponse, 500);
//     }
//   })

// Verify OTP Route
//   .post('/verify-otp', async (c) => {
//     try {
// 	  const body: VerifyOTPBody = await c.req.json();
// 	  const { phoneNumber, otp } = body;

// 	  if (!phoneNumber || !otp) {
//         const errorResponse: AuthResponse = {
// 		  success: false,
// 		  error: {
//             code: 'MISSING_FIELDS',
//             message: 'Phone number and OTP are required'
// 		  }
//         };
//         return c.json(errorResponse, 400);
// 	  }

// 	  const storedData = otpService.get(phoneNumber);

// 	  if (!storedData) {
//         const errorResponse: AuthResponse = {
// 		  success: false,
// 		  error: {
//             code: 'OTP_NOT_FOUND',
//             message: 'OTP not found or expired'
// 		  }
//         };
//         return c.json(errorResponse, 400);
// 	  }

// 	  // Check attempt limit
// 	  if (storedData.attempts >= 3) {
//         otpService.delete(phoneNumber);
//         const errorResponse: AuthResponse = {
// 		  success: false,
// 		  error: {
//             code: 'MAX_ATTEMPTS_EXCEEDED',
//             message: 'Maximum attempts exceeded'
// 		  }
//         };
//         return c.json(errorResponse, 400);
// 	  }

// 	  const isValid = await verifyOTP(otp, storedData.hashedOTP);

// 	  if (!isValid) {
// 	  // Increment attempts
//         otpService.incrementAttempts(phoneNumber);

//         const errorResponse: AuthResponse = {
// 		  success: false,
// 		  error: {
//             code: 'INVALID_OTP',
//             message: 'Invalid OTP'
// 		  },
// 		  attemptsLeft: 3 - (storedData.attempts + 1)
//         };
//         return c.json(errorResponse, 400);
// 	  }

// 	  // OTP verified successfully
// 	  otpService.delete(phoneNumber);

// 	  // Generate JWT token
// 	  const token = generateToken({ phoneNumber, verified: true });

// 	  const successResponse: AuthResponse = {
//         success: true,
//         message: 'OTP verified successfully',
//         token,
//         user: { phoneNumber, verified: true }
// 	  };
// 	  return c.json(successResponse, 200);

//     } catch (error) {
// 	  console.error('Verify OTP error:', error);
// 	  const errorResponse: AuthResponse = {
//         success: false,
//         error: {
// 		  code: 'INTERNAL_SERVER_ERROR',
// 		  message: 'Internal server error',
// 		  details: error instanceof Error ? error.message : 'Unknown error'
//         }
// 	  };
// 	  return c.json(errorResponse, 500);
//     }
//   })

// Session check route (similar to Next.js API route functionality)
  // In your backend session route
  .get('/session', async (c) => {
    try {
      const cookies = {
        get: (key: string) => {
          const cookieValue = getCookie(c, key);
          return cookieValue ? { name: key, value: cookieValue } : undefined;
        }
      };

      const user = await getUserFromSession(cookies);

      // Return 200 with null user instead of 401
      return c.json({ user: user || null });
    } catch (error) {
      console.error('Session check error:', error);
      return c.json({ user: null }, 500);
    }
  })

// Get current user (protected route example)
  .get('/me', withSession, async (c) => {
    const user = c.get('user');

    const response: AuthResponse = {
	  success: true,
	  message: 'User retrieved successfully',
	  user
    };
    return c.json(response, 200);
  })

  .get('/roles', async (c) => {

    try {
      const roles = await prisma.userRole.findMany({
        select: {
          id: true,
          roleType: true,
        },
        orderBy: { roleType: 'asc' }
      });

      const response: UserRolesResponse = {
        success: true,
        data: roles,
      };

      return c.json(response, 200);
    } catch (error) {
      console.error('Error fetching roles:', error);
      const response: AuthResponse = {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch roles',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      return c.json(response, 500);

    }

  })
// Logout route
  .post('/logout', withSession, async (c) => {
  // In a real app, you might want to blacklist the token
  // or store logout events in a database

    const response: AuthResponse = {
	  success: true,
	  message: 'Logged out successfully'
    };
    return c.json(response, 200);
  });
