import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

interface AuthRequest extends any {
  user?: { id: string; role: string; email: string };
}

// GET /api/admin/users - List all users
router.get('/users', authenticate, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    let where: any = {};

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.user.count({ where });

    res.json({
      data: users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// GET /api/admin/users/:userId - Get user details
router.get(
  '/users/:userId',
  authenticate,
  requireRole('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          employer: {
            include: {
              jobs: {
                select: {
                  id: true,
                  title: true,
                  status: true,
                },
              },
            },
          },
          helper: {
            include: {
              skills: true,
              careExperience: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  }
);

// PUT /api/admin/users/:userId/status - Update user status
router.put(
  '/users/:userId/status',
  authenticate,
  requireRole('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'suspended', 'inactive'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { status },
        select: {
          id: true,
          email: true,
          status: true,
          role: true,
        },
      });

      // Log event
      await prisma.event.create({
        data: {
          userId: req.user.id,
          eventType: 'user_status_updated',
          metadata: {
            targetUserId: userId,
            newStatus: status,
            timestamp: new Date().toISOString(),
          },
        },
      });

      res.json(user);
    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({ error: 'Failed to update user status' });
    }
  }
);

// PUT /api/admin/users/:userId/role - Update user role
router.put(
  '/users/:userId/role',
  authenticate,
  requireRole('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!role || !['employer', 'helper', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
        },
      });

      // Log event
      await prisma.event.create({
        data: {
          userId: req.user.id,
          eventType: 'user_role_updated',
          metadata: {
            targetUserId: userId,
            newRole: role,
            timestamp: new Date().toISOString(),
          },
        },
      });

      res.json(user);
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  }
);

// GET /api/admin/jobs - List all jobs
router.get('/jobs', authenticate, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    let where: any = {};

    if (status) {
      where.status = status;
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            location: true,
            user: {
              select: { email: true },
            },
          },
        },
        _count: {
          select: { matches: true },
        },
      },
      skip,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.job.count({ where });

    res.json({
      data: jobs,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('List jobs error:', error);
    res.status(500).json({ error: 'Failed to list jobs' });
  }
});

// GET /api/admin/matches - List all matches
router.get('/matches', authenticate, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { status, page = 1, limit = 20, minScore } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    let where: any = {};

    if (status) {
      where.status = status;
    }

    if (minScore) {
      where.matchScore = {
        gte: parseFloat(minScore as string),
      };
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        helper: {
          select: {
            id: true,
            fullName: true,
            nationality: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            employer: {
              select: { name: true },
            },
          },
        },
      },
      skip,
      take: parseInt(limit as string),
      orderBy: { matchScore: 'desc' },
    });

    const total = await prisma.match.count({ where });

    res.json({
      data: matches,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('List matches error:', error);
    res.status(500).json({ error: 'Failed to list matches' });
  }
});

// GET /api/admin/stats - Get platform statistics
router.get('/stats', authenticate, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const [
      totalUsers,
      totalEmployers,
      totalHelpers,
      totalJobs,
      activeJobs,
      totalMatches,
      hiredMatches,
      subscriptionCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.employer.count(),
      prisma.helper.count(),
      prisma.job.count(),
      prisma.job.count({ where: { status: 'active' } }),
      prisma.match.count(),
      prisma.match.count({ where: { status: 'hired' } }),
      prisma.subscription.count({ where: { status: 'active' } }),
    ]);

    // Get status breakdown
    const usersByStatus = await prisma.user.groupBy({
      by: ['status'],
      _count: true,
    });

    const jobsByStatus = await prisma.job.groupBy({
      by: ['status'],
      _count: true,
    });

    const matchesByStatus = await prisma.match.groupBy({
      by: ['status'],
      _count: true,
    });

    res.json({
      users: {
        total: totalUsers,
        employers: totalEmployers,
        helpers: totalHelpers,
        byStatus: usersByStatus,
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
        byStatus: jobsByStatus,
      },
      matches: {
        total: totalMatches,
        hired: hiredMatches,
        byStatus: matchesByStatus,
      },
      subscriptions: {
        active: subscriptionCount,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// GET /api/admin/events - Get audit logs
router.get('/events', authenticate, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { eventType, page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    let where: any = {};

    if (eventType) {
      where.eventType = eventType;
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        user: {
          select: { email: true, role: true },
        },
      },
      skip,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.event.count({ where });

    res.json({
      data: events,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to get events' });
  }
});

// POST /api/admin/users - Create new admin user
router.post(
  '/users',
  authenticate,
  requireRole('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { email, password, phone, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      // Check if email exists
      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (existing) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          phone,
          passwordHash,
          role: role || 'admin',
        },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          status: true,
        },
      });

      res.status(201).json(user);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

// POST /api/admin/users/:userId/reset-password - Reset user password
router.post(
  '/users/:userId/reset-password',
  authenticate,
  requireRole('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      const user = await prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      // Log event
      await prisma.event.create({
        data: {
          userId: req.user.id,
          eventType: 'password_reset',
          metadata: {
            targetUserId: userId,
            timestamp: new Date().toISOString(),
          },
        },
      });

      res.json({ message: 'Password reset successfully', user });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  }
);

// POST /api/admin/jobs/:jobId/close - Close a job
router.post(
  '/jobs/:jobId/close',
  authenticate,
  requireRole('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { jobId } = req.params;

      const job = await prisma.job.update({
        where: { id: jobId },
        data: { status: 'closed' },
      });

      // Log event
      await prisma.event.create({
        data: {
          userId: req.user.id,
          eventType: 'job_closed',
          metadata: {
            jobId,
            timestamp: new Date().toISOString(),
          },
        },
      });

      res.json(job);
    } catch (error) {
      console.error('Close job error:', error);
      res.status(500).json({ error: 'Failed to close job' });
    }
  }
);

// POST /api/admin/matches/:matchId/note - Add admin note to match
router.post(
  '/matches/:matchId/note',
  authenticate,
  requireRole('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { matchId } = req.params;
      const { note } = req.body;

      if (!note) {
        return res.status(400).json({ error: 'Note content required' });
      }

      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }

      // Append admin note to existing notes
      const updatedNotes = match.notes
        ? `${match.notes}\n\n[Admin ${new Date().toISOString()}]: ${note}`
        : `[Admin ${new Date().toISOString()}]: ${note}`;

      const updated = await prisma.match.update({
        where: { id: matchId },
        data: { notes: updatedNotes },
      });

      res.json(updated);
    } catch (error) {
      console.error('Add admin note error:', error);
      res.status(500).json({ error: 'Failed to add note' });
    }
  }
);

// GET /api/admin/health - Health check
router.get('/health', authenticate, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    // Test database connection
    await prisma.user.findFirst();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Database connection failed',
    });
  }
});

export default router;
