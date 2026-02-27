import { Router, Request } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { calculateMatchScore } from '../utils/matching';
import { generateReadableId } from '../utils/idGenerator';

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

// GET /api/employers/profile - Get employer profile
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const employer = await prisma.employer.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: { email: true, phone: true, status: true },
        },
        jobs: {
          where: { status: 'active' },
          include: {
            matches: {
              include: {
                helper: {
                  select: {
                    id: true,
                    fullName: true,
                    profilePhotoUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!employer) {
      return res.status(404).json({ error: 'Employer profile not found' });
    }

    res.json(employer);
  } catch (error) {
    console.error('Get employer profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// POST /api/employers/profile - Create or update employer profile
router.post(
  '/profile',
  authenticate,
  requireRole('employer'),
  async (req: AuthRequest, res) => {
    try {
      const {
        name,
        householdSize,
        adults,
        children,
        childrenAges,
        hasElderly,
        elderlyCareNeeds,
        location,
        languagePreferences,
        preferredHelperTraits,
        householdRules,
        preferredStartDate,
        birthdate,
        wuxingElement,
        westernZodiac,
      } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      let employer = await prisma.employer.findUnique({
        where: { userId: req.user.id },
      });

      if (employer) {
        // Update existing
        employer = await prisma.employer.update({
          where: { userId: req.user.id },
          data: {
            name: name || undefined,
            householdSize: householdSize || undefined,
            adults: adults || undefined,
            children: children || undefined,
            childrenAges: childrenAges || undefined,
            hasElderly: hasElderly !== undefined ? hasElderly : undefined,
            elderlyCareNeeds: elderlyCareNeeds || undefined,
            location: location || undefined,
            languagePreferences: languagePreferences || undefined,
            preferredHelperTraits: preferredHelperTraits || undefined,
            householdRules: householdRules || undefined,
            preferredStartDate: preferredStartDate ? new Date(preferredStartDate) : undefined,
            birthdate: birthdate ? new Date(birthdate) : undefined,
            wuxingElement: wuxingElement || undefined,
            westernZodiac: westernZodiac || undefined,
          },
          include: {
            user: {
              select: { email: true, phone: true, status: true },
            },
          },
        });
      } else {
        // Create new
        employer = await prisma.employer.create({
          data: {
            userId: req.user.id,
            readableId: generateReadableId('employer'),
            name,
            householdSize,
            adults,
            children,
            childrenAges,
            hasElderly,
            elderlyCareNeeds,
            location,
            languagePreferences,
            preferredHelperTraits,
            householdRules,
            preferredStartDate: preferredStartDate ? new Date(preferredStartDate) : undefined,
            birthdate: birthdate ? new Date(birthdate) : undefined,
            wuxingElement,
            westernZodiac,
          },
          include: {
            user: {
              select: { email: true, phone: true, status: true },
            },
          },
        });
      }

      // Recalculate matches for all active jobs
      try {
        const activeJobs = await prisma.job.findMany({
          where: { employerId: employer.id, status: 'active' },
          include: {
            matches: {
              include: {
                helper: {
                  include: {
                    skills: true,
                    careExperience: true,
                  },
                },
              },
            },
          },
        });

        const employerWithComputed = {
          ...employer,
          hasChildren: (employer.children || 0) > 0,
          hasElderly: !!employer.hasElderly,
        };

        for (const job of activeJobs) {
          for (const match of job.matches) {
            const { totalScore, breakdown } = await calculateMatchScore(
              match.helper,
              job,
              employerWithComputed
            );

            // Update match if score changed
            if (match.matchScore !== totalScore) {
              await prisma.match.update({
                where: { id: match.id },
                data: {
                  matchScore: totalScore,
                  matchBreakdown: breakdown as any, // Cast to any to avoid strict JSON type issues
                },
              });
            }
          }
        }
      } catch (matchError) {
        console.error('Failed to recalculate matches:', matchError);
        // Don't block the response, just log the error
      }

      res.status(201).json(employer);
    } catch (error) {
      console.error('Create/update employer profile error:', error);
      res.status(500).json({ error: 'Failed to save profile' });
    }
  }
);

// GET /api/employers/jobs - Get employer's jobs
router.get('/jobs', authenticate, requireRole('employer'), async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const employer = await prisma.employer.findUnique({
      where: { userId: req.user.id },
    });

    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    const jobs = await prisma.job.findMany({
      where: { employerId: employer.id },
      include: {
        matches: {
          include: {
            helper: {
              select: {
                id: true,
                fullName: true,
                displayName: true,
                nationality: true,
                currentLocation: true,
                yearsExperienceTotal: true,
                profilePhotoUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
});

// POST /api/employers/jobs - Create a new job
router.post(
  '/jobs',
  authenticate,
  requireRole('employer'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const {
      title,
      description,
      duties,
      preferredExperienceYears,
      preferredLanguages,
      preferredStartDate,
      salaryRange,
    } = req.body;

    const normalizedDuties = Array.isArray(duties)
      ? duties.filter(Boolean)
      : typeof duties === 'string'
        ? [duties]
        : duties && typeof duties === 'object'
          ? Object.entries(duties).flatMap(([key, value]) => {
              const result = [];
              if (value === true) {
                result.push(key);
              } else if (typeof value === 'string') {
                result.push(value);
                // Add standard key mapping for matching
                if (key === 'cooking' && value !== 'No Cooking') result.push('cooking');
                if (key === 'care') result.push('care');
              } else if (typeof value === 'number') {
                result.push(String(value));
              }
              return result;
            }).filter(Boolean)
          : [];

    if (!title) {
      return res.status(400).json({ error: 'Job title is required' });
    }

    const employer = await prisma.employer.findUnique({
      where: { userId: req.user.id },
    });

      if (!employer) {
        return res.status(404).json({ error: 'Employer not found' });
      }

      const job = await prisma.job.create({
        data: {
          employerId: employer.id,
          title,
          description,
          duties: normalizedDuties,
          preferredExperienceYears,
          preferredLanguages,
          preferredStartDate: preferredStartDate ? new Date(preferredStartDate) : undefined,
          salaryRange,
        },
      });

      const helpers = await prisma.helper.findMany({
        include: {
          skills: true,
          careExperience: true,
        },
      });

      const employerWithComputed = {
        ...employer,
        hasChildren: (employer.children || 0) > 0,
        hasElderly: !!employer.hasElderly,
      };

      const potentialMatches = [];
      for (const helper of helpers) {
        const { totalScore, breakdown } = await calculateMatchScore(
          helper,
          { ...job, duties: normalizedDuties },
          employerWithComputed
        );

        if (totalScore >= 50) {
          potentialMatches.push({
            jobId: job.id,
            helperId: helper.id,
            matchScore: totalScore,
            matchBreakdown: breakdown,
            sourceType: 'auto_match',
          });
        }
      }

      if (potentialMatches.length > 0) {
        await prisma.match.createMany({
          data: potentialMatches as any,
          skipDuplicates: true,
        });
      }

      res.status(201).json(job);
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ error: 'Failed to create job' });
    }
  }
);

// GET /api/employers/jobs/:jobId - Get specific job
router.get(
  '/jobs/:jobId',
  authenticate,
  requireRole('employer'),
  async (req: AuthRequest, res) => {
    try {
      const { jobId } = req.params;

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const job = await prisma.job.findUnique({
        where: { id: jobId as string },
        include: {
          employer: true,
          matches: {
            include: {
              helper: true,
            },
            orderBy: { matchScore: 'desc' },
          },
        },
      });

      if (!job || job.employer.userId !== req.user.id) {
        return res.status(404).json({ error: 'Job not found or not authorized' });
      }

      res.json(job);
    } catch (error) {
      console.error('Get job error:', error);
      res.status(500).json({ error: 'Failed to get job' });
    }
  }
);

// PUT /api/employers/jobs/:jobId - Update job
router.put(
  '/jobs/:jobId',
  authenticate,
  requireRole('employer'),
  async (req: AuthRequest, res) => {
    try {
      const { jobId } = req.params;
      const { title, description, duties, preferredExperienceYears, preferredLanguages, preferredStartDate, salaryRange, status } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const job = await prisma.job.findUnique({
        where: { id: jobId as string },
        include: {
          employer: true,
        },
      });

      if (!job || job.employer.userId !== req.user.id) {
        return res.status(404).json({ error: 'Job not found or not authorized' });
      }

      const updatedJob = await prisma.job.update({
        where: { id: jobId as string },
        data: {
          title: title || undefined,
          description: description || undefined,
          duties: duties || undefined,
          preferredExperienceYears: preferredExperienceYears || undefined,
          preferredLanguages: preferredLanguages || undefined,
          preferredStartDate: preferredStartDate ? new Date(preferredStartDate) : undefined,
          salaryRange: salaryRange || undefined,
          status: status || undefined,
        },
      });

      res.json(updatedJob);
    } catch (error) {
      console.error('Update job error:', error);
      res.status(500).json({ error: 'Failed to update job' });
    }
  }
);

// DELETE /api/employers/jobs/:jobId - Delete/close job
router.delete(
  '/jobs/:jobId',
  authenticate,
  requireRole('employer'),
  async (req: AuthRequest, res) => {
    try {
      const { jobId } = req.params;

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const job = await prisma.job.findUnique({
        where: { id: jobId as string },
        include: {
          employer: true,
        },
      });

      if (!job || job.employer.userId !== req.user.id) {
        return res.status(404).json({ error: 'Job not found or not authorized' });
      }

      // Soft delete by updating status
      const deletedJob = await prisma.job.update({
        where: { id: jobId as string },
        data: { status: 'closed' },
      });

      res.json({ message: 'Job closed', job: deletedJob });
    } catch (error) {
      console.error('Delete job error:', error);
      res.status(500).json({ error: 'Failed to delete job' });
    }
  }
);

// GET /api/employers/stats - Get employer statistics
router.get(
  '/stats',
  authenticate,
  requireRole('employer'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const employer = await prisma.employer.findUnique({
        where: { userId: req.user.id },
      });

      if (!employer) {
        return res.status(404).json({ error: 'Employer not found' });
      }

      const [totalJobs, activeJobs, totalMatches, hiringMatches] = await Promise.all([
        prisma.job.count({
          where: { employerId: employer.id },
        }),
        prisma.job.count({
          where: { employerId: employer.id, status: 'active' },
        }),
        prisma.match.count({
          where: {
            job: { employerId: employer.id },
          },
        }),
        prisma.match.count({
          where: {
            job: { employerId: employer.id },
            status: 'hired',
          },
        }),
      ]);

      res.json({
        totalJobs,
        activeJobs,
        totalMatches,
        hiringMatches,
      });
    } catch (error) {
      console.error('Get employer stats error:', error);
      res.status(500).json({ error: 'Failed to get statistics' });
    }
  }
);

export default router;
