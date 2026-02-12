import { Router, Request } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { calculateMatchScore } from '../utils/matching';

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

// GET /api/matches/:jobId - Get all matches for a job
router.get('/:jobId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { jobId } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId as string },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Authorization check - must be employer or admin
    if (req.user.role === 'employer' && job.employer.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const matches = await prisma.match.findMany({
      where: { jobId: jobId as string },
      include: {
        helper: {
          select: {
            id: true,
            fullName: true,
            displayName: true,
            nationality: true,
            currentLocation: true,
            yearsExperienceTotal: true,
            yearsExperienceLocal: true,
            languages: true,
            profilePhotoUrl: true,
            expectedSalaryMin: true,
            expectedSalaryMax: true,
          },
        },
      },
      orderBy: { matchScore: 'desc' },
    });

    res.json(matches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to get matches' });
  }
});

// GET /api/matches - Get matches for authenticated user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, sortBy = 'score', page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let where: any = {};

    if (req.user.role === 'helper') {
      // Get matches for this helper
      const helper = await prisma.helper.findUnique({
        where: { userId: req.user.id },
      });

      if (!helper) {
        return res.status(404).json({ error: 'Helper not found' });
      }

      where.helperId = helper.id;
    } else if (req.user.role === 'employer') {
      // Get matches for this employer's jobs
      const employer = await prisma.employer.findUnique({
        where: { userId: req.user.id },
      });

      if (!employer) {
        return res.status(404).json({ error: 'Employer not found' });
      }

      where.job = {
        employerId: employer.id,
      };
    }

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    let orderBy: any = { matchScore: 'desc' };
    if (sortBy === 'recent') {
      orderBy = { createdAt: 'desc' };
    } else if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' };
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        helper: {
          select: {
            id: true,
            fullName: true,
            nationality: true,
            profilePhotoUrl: true,
            yearsExperienceTotal: true,
            skills: true,
            languages: true,
            availableFrom: true,
            aboutMe: true,
            expectedSalaryMin: true,
            expectedSalaryMax: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            salaryRange: true,
            preferredStartDate: true,
            duties: true,
            employer: {
              select: {
                id: true,
                name: true,
                location: true,
                householdSize: true,
              }
            }
          },
        },
      },
      orderBy,
      skip,
      take: parseInt(limit as string),
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
    console.error('Get user matches error:', error);
    res.status(500).json({ error: 'Failed to get matches' });
  }
});

// GET /api/matches/:matchId - Get match details
router.get(
  '/detail/:matchId',
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { matchId } = req.params;

      const match = await prisma.match.findUnique({
        where: { id: matchId as string },
        include: {
          helper: true,
          job: {
            include: {
              employer: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      if (!match || !match.job) {
        return res.status(404).json({ error: 'Match not found' });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Authorization check
      if (req.user.role === 'helper') {
        const helper = await prisma.helper.findUnique({
          where: { userId: req.user.id },
        });
        if (!helper || match.helperId !== helper.id) {
          return res.status(403).json({ error: 'Not authorized' });
        }
      } else if (req.user.role === 'employer') {
        if (match.job.employer.userId !== req.user.id) {
          return res.status(403).json({ error: 'Not authorized' });
        }
      }

      res.json(match);
    } catch (error) {
      console.error('Get match detail error:', error);
      res.status(500).json({ error: 'Failed to get match details' });
    }
  }
);

// POST /api/matches/calculate - Calculate match score for helper-job pair
router.post(
  '/calculate',
  authenticate,
  requireRole('admin', 'employer'),
  async (req: AuthRequest, res) => {
    try {
      const { helperId, jobId } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!helperId || !jobId) {
        return res.status(400).json({ error: 'Helper ID and Job ID required' });
      }

      const helper = await prisma.helper.findUnique({
        where: { id: helperId },
        include: {
          skills: true,
          careExperience: true,
        },
      });

      if (!helper) {
        return res.status(404).json({ error: 'Helper not found' });
      }

      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          employer: true,
        },
      });

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Authorization check for employers
      if (req.user.role === 'employer') {
        const employer = await prisma.employer.findUnique({
          where: { userId: req.user.id },
        });
        if (!employer || job.employer.id !== employer.id) {
          return res.status(403).json({ error: 'Not authorized' });
        }
      }

      // Prepare employer data with computed fields
      const employerWithComputed = {
        ...job.employer,
        hasChildren: (job.employer.children || 0) > 0,
      };

      const { totalScore, breakdown } = await calculateMatchScore(
        helper,
        job,
        employerWithComputed
      );

      res.json({
        matchScore: totalScore,
        matchBreakdown: breakdown,
        helperId,
        jobId,
      });
    } catch (error) {
      console.error('Calculate match score error:', error);
      res.status(500).json({ error: 'Failed to calculate match' });
    }
  }
);

// PUT /api/matches/:matchId/status - Update match status
router.put(
  '/:matchId/status',
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { matchId } = req.params;
      const { status, notes } = req.body;

      if (
        !status ||
        !['pending', 'shortlisted', 'interviewed', 'hired', 'rejected'].includes(
          status
        )
      ) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const match = await prisma.match.findUnique({
        where: { id: matchId as string },
        include: {
          job: {
            include: {
              employer: true,
            },
          },
          helper: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!match || !match.job) {
        return res.status(404).json({ error: 'Match not found' });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Authorization - only employer or admin can update
      if (
        req.user.role === 'employer' &&
        match.job.employer.userId !== req.user.id
      ) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const updatedMatch = await prisma.match.update({
        where: { id: matchId as string },
        data: {
          status,
          notes: notes || undefined,
        },
      });

      // Log event
      await prisma.event.create({
        data: {
          userId: req.user.id,
          eventType: 'match_status_updated',
          metadata: {
            matchId,
            newStatus: status,
            timestamp: new Date().toISOString(),
          },
        },
      });

      res.json(updatedMatch);
    } catch (error) {
      console.error('Update match status error:', error);
      res.status(500).json({ error: 'Failed to update match' });
    }
  }
);

// POST /api/matches/bulk-create - Create matches for a job (admin/system)
router.post(
  '/bulk-create',
  authenticate,
  requireRole('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { jobId, threshold = 50 } = req.body;

      if (!jobId) {
        return res.status(400).json({ error: 'Job ID required' });
      }

      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          employer: true,
        },
      });

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Get all helpers
      const helpers = await prisma.helper.findMany({
        include: {
          skills: true,
          careExperience: true,
        },
      });

      // Calculate matches for each helper
      const potentialMatches = [];
      for (const helper of helpers) {
        // Skip if already matched
        const existing = await prisma.match.findUnique({
          where: {
            jobId_helperId: {
              jobId,
              helperId: helper.id,
            },
          },
        });

        if (existing) continue;

        // Prepare employer data with computed fields
        const employerWithComputed = {
          ...job.employer,
          hasChildren: (job.employer.children || 0) > 0,
        };

        const { totalScore, breakdown } = await calculateMatchScore(
          helper,
          job,
          employerWithComputed
        );

        if (totalScore >= threshold) {
          potentialMatches.push({
            jobId,
            helperId: helper.id,
            matchScore: totalScore,
            matchBreakdown: breakdown,
            sourceType: 'auto_match',
          });
        }
      }

      // Create matches in batch
      if (potentialMatches.length > 0) {
        // Use any cast to bypass the type check for now since MatchSource is an enum
        // and we are passing a string.
        const created = await prisma.match.createMany({
          data: potentialMatches as any,
          skipDuplicates: true,
        });

        return res.json({
          message: `Created ${created.count} matches`,
          count: created.count,
        });
      }

      res.json({
        message: 'No matches found above threshold',
        count: 0,
      });
    } catch (error) {
      console.error('Bulk create matches error:', error);
      res.status(500).json({ error: 'Failed to create matches' });
    }
  }
);

// DELETE /api/matches/:matchId - Delete/reject a match
router.delete('/:matchId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { matchId } = req.params;

    const match = await prisma.match.findUnique({
      where: { id: matchId as string },
      include: {
        job: {
          include: {
            employer: true,
          },
        },
        helper: true,
      },
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Authorization
    if (req.user.role === 'employer') {
      if (!match.job || match.job.employer.userId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    } else if (req.user.role === 'helper') {
      const helper = await prisma.helper.findUnique({
        where: { userId: req.user.id },
      });
      if (!helper || match.helperId !== helper.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }

    // Update status to rejected instead of hard delete
    const rejected = await prisma.match.update({
      where: { id: matchId as string },
      data: { status: 'rejected' },
    });

    res.json({ message: 'Match rejected', match: rejected });
  } catch (error) {
    console.error('Delete match error:', error);
    res.status(500).json({ error: 'Failed to delete match' });
  }
});

export default router;
