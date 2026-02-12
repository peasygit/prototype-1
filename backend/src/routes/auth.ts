import { Router, Request } from 'express';
import { prisma } from '../utils/prisma';
import { insforge, createServiceClient } from '../utils/insforge';
import { authenticate } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}
// const prisma = new PrismaClient(); // Removed

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, phone, role } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password and role required' });
    }

    if (!['employer', 'helper', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // 1. Create user in InsForge Auth
    const response = await insforge.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          phone,
        }
      } as any
    });
    
    console.log('SignUp Response:', JSON.stringify(response, null, 2));

    const { data: authData, error: authError } = response;

    if (authError) {
      console.error('InsForge Auth Error:', authError);

      // DEV FIX: If sign up fails with "Email verification required" (unlikely but possible depending on config)
      // OR "User already registered" (we can check if they are unverified)
      if (authError.message.includes('Email verification') || authError.message.includes('Email not confirmed')) {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
             const token = `DEV_TOKEN_${user.id}`;
             return res.status(201).json({ 
               user, 
               token, 
               verificationRequired: true 
             });
          }
      }

      return res.status(400).json({ error: authError.message });
    }

    // Handle case where user is created but verification is required (InsForge doesn't return user object)
    if (authData?.requireEmailVerification && !authData.user) {
        return res.status(200).json({
            message: 'Verification email sent',
            requireEmailVerification: true
        });
    }

    if (!authData || !authData.user) {
      return res.status(500).json({ error: 'Failed to create auth user' });
    }

    // 2. Create user profile in our database (linked by ID)
    // Note: We use the same ID from InsForge Auth to link them easily
    const user = await prisma.user.create({
      data: {
        id: authData.user.id, // Link to InsForge Auth ID
        email,
        phone,
        passwordHash: 'managed_by_insforge', // No longer storing hash locally
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // DEV FIX: If email verification is enabled, accessToken might be null.
    // In this case, we return a DEV_TOKEN to allow the user to proceed in the prototype.
    const token = authData.accessToken || `DEV_TOKEN_${user.id}`;
    
    // Check if email verification is pending (no accessToken means verification needed)
    const verificationRequired = !authData.accessToken;

    res.status(201).json({ user, token, verificationRequired });
  } catch (error) {
    console.error('Register error:', error);
    // Check for Prisma unique constraint violation
    if ((error as any).code === 'P2002') {
      return res.status(409).json({ error: 'Email already registered in database' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { error } = await insforge.auth.sendResetPasswordEmail(email);

    if (error) {
      console.error('Forgot password error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// Reset Password (Update)
router.post('/reset-password', async (req, res) => {
  try {
    const { password, accessToken } = req.body;

    if (!password || !accessToken) {
      return res.status(400).json({ error: 'Password and access token required' });
    }

    // Create a client with the user's access token
    const client = createServiceClient(accessToken);
    
    const { error } = await (client.auth as any).updateUser({
      password: password
    });

    if (error) {
      console.error('Reset password error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // 1. Authenticate with InsForge
    const { data: authData, error: authError } = await insforge.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('InsForge Auth Error:', authError);
      
      // DEV FIX: Check for verification issues
      const errorMessage = authError.message.toLowerCase();
      const isVerificationError = 
        errorMessage.includes('email verification') || 
        errorMessage.includes('email not confirmed') ||
        errorMessage.includes('email not verified');
      
      console.log(`Login error: ${authError.message}, treating as verification error: ${isVerificationError}`);

      if (isVerificationError) {
             return res.status(200).json({
                message: 'Verification required',
                requireEmailVerification: true
             });
      }
      return res.status(401).json({ error: authError.message });
    }

    if (!authData || !authData.user || !authData.accessToken) {
      return res.status(500).json({ error: 'Login failed' });
    }

    // 2. Get user profile from our database
    let user = await prisma.user.findUnique({
      where: { id: authData.user.id },
    });

    if (!user) {
        // Try to recover if missing in DB but exists in Auth (Zombie User)
        const metadata = authData.user.metadata as Record<string, any> || {};
        const userRole = metadata.role;
        const userPhone = metadata.phone;

        if (userRole) {
            console.log(`Recovering missing Prisma profile for user ${authData.user.id}`);
            user = await prisma.user.create({
                data: {
                    id: authData.user.id,
                    email: authData.user.email!,
                    role: userRole as UserRole,
                    phone: userPhone || '',
                    passwordHash: 'managed_by_insforge',
                    status: 'active'
                }
            });
            
            if (userRole === 'employer') {
                 await prisma.employer.create({ data: { userId: user.id } });
            }
        } else {
             return res.status(404).json({ error: 'User profile not found. Please register again.' });
        }
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account suspended' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token: authData.accessToken, // Return InsForge Access Token
      // expiresIn: authData.session.expires_in, // Removed as session might not be available
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify Email (OTP)
router.post('/verify', async (req, res) => {
  try {
    const { email, token, role, phone, name } = req.body;

    if (!email || !token) {
      return res.status(400).json({ error: 'Email and verification code required' });
    }

    // Verify OTP with InsForge
    // Use verifyEmail which accepts otp
    let { data: authData, error: authError } = await insforge.auth.verifyEmail({
      email,
      otp: token,
    });

    if (authError) {
      console.error('InsForge Verify Error:', authError);
      return res.status(400).json({ error: authError.message });
    }
    
    // DEBUG: Log authData keys to verify structure
    console.log('Verify AuthData keys:', authData ? Object.keys(authData) : 'null');
    if (authData) {
        console.log('Verify AuthData.user:', authData.user ? 'present' : 'missing');
        console.log('Verify AuthData.accessToken:', authData.accessToken ? 'present' : 'missing');
        if ((authData as any).session) console.log('Verify AuthData.session:', 'present');
    }

    // Handle potential nested session structure (common in Supabase-like SDKs)
    if (authData && (authData as any).session?.access_token) {
        console.log('Using accessToken from session.access_token');
        authData.accessToken = (authData as any).session.access_token;
    } else if (authData && !authData.accessToken && (authData as any).session?.access_token) {
        console.log('Adjusting accessToken from session.access_token (fallback)');
        authData.accessToken = (authData as any).session.access_token;
    }

    if (!authData || !authData.user || !authData.accessToken) {
       console.error('Invalid authData structure:', authData);
       return res.status(400).json({ error: 'Verification failed' });
    }

    // Ensure user exists in our DB
    let user = await prisma.user.findUnique({
      where: { id: authData.user.id },
    });
    
    if (!user) {
        // Check if user exists by email (to handle re-registration or ID mismatch)
        const existingUserByEmail = await prisma.user.findUnique({
             where: { email: authData.user.email! }
        });

        if (existingUserByEmail) {
             console.log(`User exists by email ${authData.user.email} but ID mismatch. Deleting old record to sync with InsForge.`);
             // Delete old record to allow new creation with correct ID
             await prisma.user.delete({
                 where: { email: authData.user.email! }
             });
        }

        // Try to get role/phone from metadata if not provided
        const metadata = authData.user.metadata as Record<string, any> || {};
        const userRole = role || metadata.role;
        const userPhone = phone || metadata.phone;

        if (userRole) {
            // Create user profile if missing (deferred creation)
            user = await prisma.user.create({
                data: {
                    id: authData.user.id,
                    email: authData.user.email!,
                    role: userRole as UserRole,
                    phone: userPhone || '', // Fallback to empty string if missing
                    passwordHash: 'managed_by_insforge',
                    status: 'active'
                }
            });
            
            // Create specific profile
            if (userRole === 'employer') {
                 await prisma.employer.create({ 
                    data: { 
                        userId: user.id,
                        name: name || undefined
                    } 
                 });
            } 
            // Note: Helper profile requires many fields, so we create it later when they fill the profile
        } else {
             return res.status(404).json({ error: 'User profile not found. Please register again.' });
        }
    }

    // Ensure employer profile exists (especially if user was created via register but not verified yet)
    if (user.role === 'employer') {
        const employer = await prisma.employer.findUnique({ where: { userId: user.id } });
        if (!employer) {
             await prisma.employer.create({ 
                 data: { 
                     userId: user.id,
                     name: name || undefined
                 } 
             });
        } else if (name) {
             await prisma.employer.update({
                 where: { userId: user.id },
                 data: { name }
             });
        }
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token: authData.accessToken,
    });

  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    // Middleware will attach user
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        employer: true,
        helper: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      employer: user.employer,
      helper: user.helper,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;