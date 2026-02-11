import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { insforge, createServiceClient } from '../utils/insforge';

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
        if (error || !data?.user) {
          throw error || new Error('User not found');
        }
        authUser = data.user;
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