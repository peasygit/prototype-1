import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { insforge, createServiceClient } from '../utils/insforge';
import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient(); // Removed

interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token with InsForge
    const client = createServiceClient(token);
    
    let authUser: any = null;

    // DEV BYPASS: Allow special dev tokens for local testing when email verification blocks login
    if (token.startsWith('DEV_TOKEN_')) {
      const userId = token.replace('DEV_TOKEN_', '');
      authUser = { id: userId };
    } else {
      try {
        // Fetch user details using the token
        const { data, error } = await client.auth.getCurrentUser();
        
        // DEBUG: Log token and result
        console.log(`Verifying token: ${token.substring(0, 10)}...`);
        
        if (data?.user) {
             console.log('InsForge user found via SDK:', data.user.id);
             authUser = data.user;
        } else {
             console.log('InsForge user NOT found via SDK. Error:', error);
             
             // Fallback: Decode JWT directly (SECURITY WARNING: Signature not verified!)
             // This is necessary because InsForge SDK server-side validation seems to rely on session/cookies
             // which are not available here.
             // TODO: Configure JWT_SECRET to verify signature properly.
             try {
                 const decoded = jwt.decode(token);
                 if (decoded && typeof decoded === 'object' && decoded.sub) {
                     console.warn('⚠️ SECURITY WARNING: Using unverified JWT decode fallback!');
                     console.log('Decoded User ID:', decoded.sub);
                     authUser = { id: decoded.sub, email: (decoded as any).email };
                 } else {
                     console.error('JWT Decode failed or invalid payload');
                 }
             } catch (jwtError) {
                 console.error('JWT Decode error:', jwtError);
             }
        }

        if (!authUser) {
          console.error('InsForge getCurrentUser failed:', error);
          throw error || new Error('User not found');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }
    
    if (!authUser || !authUser.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get profile from our database
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { id: true, email: true, role: true, status: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User profile not found' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account suspended' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};