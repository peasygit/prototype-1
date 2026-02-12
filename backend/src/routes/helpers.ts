import { Router, Request } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

// GET / - List helpers with filters (Public)
router.get('/', async (req, res) => {
  try {
    const {
      nationality,
      minExperience,
      maxExperience,
      skills,
      limit = '20',
      offset = '0'
    } = req.query;

    const where: any = {};

    // Filter by nationality
    if (nationality) {
      where.nationality = nationality as string;
    }

    // Filter by experience
    if (minExperience || maxExperience) {
      where.yearsExperienceTotal = {};
      if (minExperience) where.yearsExperienceTotal.gte = parseInt(minExperience as string);
      if (maxExperience) where.yearsExperienceTotal.lte = parseInt(maxExperience as string);
    }

    // Filter by skills
    if (skills) {
      const skillList = (skills as string).split(',');
      where.skills = {
        some: {
          skillType: {
            in: skillList,
            mode: 'insensitive'
          }
        }
      };
    }

    // Only active helpers (using relation filter on User model)
    where.user = {
      status: 'active'
    };

    const helpers = await prisma.helper.findMany({
      where,
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      include: {
        skills: true,
        careExperience: true,
        user: {
          select: {
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.helper.count({ where });

    res.json({
      data: helpers,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    });
  } catch (error) {
    console.error('List helpers error:', error);
    res.status(500).json({ error: 'Failed to list helpers' });
  }
});

// GET /api/helpers/profile - Get helper profile
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const helper = await prisma.helper.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: { email: true, phone: true, status: true },
        },
        skills: true,
        careExperience: true,
      },
    });

    if (!helper) {
      return res.status(404).json({ error: 'Helper profile not found' });
    }

    res.json(helper);
  } catch (error) {
    console.error('Get helper profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// POST /api/helpers/profile - Create or update helper profile
router.post(
  '/profile',
  authenticate,
  requireRole('helper'),
  async (req: AuthRequest, res) => {
    try {
      const {
        fullName,
        displayName,
        nationality,
        birthdate,
        religion,
        currentLocation,
        contractStatus,
        availableFrom,
        yearsExperienceTotal,
        yearsExperienceLocal,
        educationLevel,
        languages,
        aboutMe,
        profilePhotoUrl,
        expectedSalaryMin,
        expectedSalaryMax,
        personalityTraits,
        workStylePreference,
        cannotAccept,
        wuxingElement,
        westernZodiac,
        skills,
        careExperience,
      } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!fullName || !nationality) {
        return res.status(400).json({ error: 'Name and nationality are required' });
      }

      let helper = await prisma.helper.findUnique({
        where: { userId: req.user.id },
      });

      // Validate required fields for creation
      if (!helper && (!birthdate || !nationality)) {
        return res.status(400).json({ error: 'Birthdate and nationality are required for new profiles' });
      }

      // Prepare skills and careExperience operations
      const skillsOp = skills ? {
        deleteMany: {},
        create: Array.isArray(skills) ? skills.map((s: any) => ({
          skillType: typeof s === 'string' ? s : s.skillType,
          proficiencyLevel: s.proficiencyLevel || 'good'
        })) : []
      } : undefined;

      const careExperienceOp = careExperience ? {
        deleteMany: {},
        create: Array.isArray(careExperience) ? careExperience.map((c: any) => ({
          targetType: typeof c === 'string' ? c : c.targetType,
          yearsExperience: c.yearsExperience || 1
        })) : []
      } : undefined;

      if (helper) {
        // Update existing
        helper = await prisma.helper.update({
          where: { userId: req.user!.id },
          data: {
            fullName,
            displayName: displayName || undefined,
            nationality,
            birthdate: birthdate ? new Date(birthdate) : undefined,
            religion: religion || undefined,
            currentLocation,
            contractStatus,
            availableFrom: availableFrom ? new Date(availableFrom) : undefined,
            yearsExperienceTotal,
            yearsExperienceLocal,
            educationLevel: educationLevel || undefined,
            languages: languages || undefined,
            aboutMe: aboutMe || undefined,
            profilePhotoUrl: profilePhotoUrl || undefined,
            expectedSalaryMin: expectedSalaryMin || undefined,
            expectedSalaryMax: expectedSalaryMax || undefined,
            personalityTraits: personalityTraits || undefined,
            workStylePreference: workStylePreference || undefined,
            cannotAccept: cannotAccept || undefined,
            wuxingElement: wuxingElement || undefined,
            westernZodiac: westernZodiac || undefined,
            skills: skillsOp,
            careExperience: careExperienceOp,
          },
          include: {
            user: {
              select: { email: true, phone: true, status: true },
            },
            skills: true,
            careExperience: true,
          },
        });
      } else {
        // Create new
        helper = await prisma.helper.create({
          data: {
            userId: req.user!.id,
            fullName,
            displayName,
            nationality,
            birthdate: new Date(birthdate!),
            religion,
            currentLocation,
            contractStatus,
            availableFrom: availableFrom ? new Date(availableFrom) : undefined,
            yearsExperienceTotal,
            yearsExperienceLocal,
            educationLevel,
            languages,
            aboutMe,
            profilePhotoUrl,
            expectedSalaryMin,
            expectedSalaryMax,
            personalityTraits,
            workStylePreference,
            cannotAccept,
            wuxingElement,
            westernZodiac,
            skills: skills ? {
              create: Array.isArray(skills) ? skills.map((s: any) => ({
                skillType: typeof s === 'string' ? s : s.skillType,
                proficiencyLevel: s.proficiencyLevel || 'good'
              })) : []
            } : undefined,
            careExperience: careExperience ? {
              create: Array.isArray(careExperience) ? careExperience.map((c: any) => ({
                targetType: typeof c === 'string' ? c : c.targetType,
                yearsExperience: c.yearsExperience || 1
              })) : []
            } : undefined,
          },
          include: {
            user: {
              select: { email: true, phone: true, status: true },
            },
            skills: true,
            careExperience: true,
          },
        });
      }

      res.status(201).json(helper);
    } catch (error) {
      console.error('Create/update helper profile error:', error);
      res.status(500).json({ error: 'Failed to save profile' });
    }
  }
);

// POST /api/helpers/skills - Add/update helper skill
router.post(
  '/skills',
  authenticate,
  requireRole('helper'),
  async (req: AuthRequest, res) => {
    try {
      const { skillType, proficiencyLevel } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!skillType || !proficiencyLevel) {
        return res.status(400).json({ error: 'Skill type and proficiency level required' });
      }

      const helper = await prisma.helper.findUnique({
        where: { userId: req.user.id },
      });

      if (!helper) {
        return res.status(404).json({ error: 'Helper not found' });
      }

      const skill = await prisma.helperSkill.upsert({
        where: {
          helperId_skillType: {
            helperId: helper.id,
            skillType,
          },
        },
        update: {
          proficiencyLevel,
        },
        create: {
          helperId: helper.id,
          skillType,
          proficiencyLevel,
        },
      });

      res.status(201).json(skill);
    } catch (error) {
      console.error('Add skill error:', error);
      res.status(500).json({ error: 'Failed to add skill' });
    }
  }
);

// GET /api/helpers/skills - Get helper skills
router.get('/skills', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const helper = await prisma.helper.findUnique({
      where: { userId: req.user.id },
    });

    if (!helper) {
      return res.status(404).json({ error: 'Helper not found' });
    }

    const skills = await prisma.helperSkill.findMany({
      where: { helperId: helper.id },
    });

    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Failed to get skills' });
  }
});

// DELETE /api/helpers/skills/:skillId - Delete skill
router.delete(
  '/skills/:skillId',
  authenticate,
  requireRole('helper'),
  async (req: AuthRequest, res) => {
    try {
      const { skillId } = req.params;

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const helper = await prisma.helper.findUnique({
        where: { userId: req.user.id },
      });

      if (!helper) {
        return res.status(404).json({ error: 'Helper not found' });
      }

      const skill = await prisma.helperSkill.findUnique({
        where: { id: skillId as string },
      });

      if (!skill || skill.helperId !== helper.id) {
        return res.status(404).json({ error: 'Skill not found or not authorized' });
      }

      await prisma.helperSkill.delete({
        where: { id: skillId as string },
      });

      res.json({ message: 'Skill deleted' });
    } catch (error) {
      console.error('Delete skill error:', error);
      res.status(500).json({ error: 'Failed to delete skill' });
    }
  }
);

// POST /api/helpers/care-experience - Add care experience
router.post(
  '/care-experience',
  authenticate,
  requireRole('helper'),
  async (req: AuthRequest, res) => {
    try {
      const { targetType, yearsExperience } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!targetType || yearsExperience === undefined) {
        return res.status(400).json({ error: 'Target type and years required' });
      }

      const helper = await prisma.helper.findUnique({
        where: { userId: req.user.id },
      });

      if (!helper) {
        return res.status(404).json({ error: 'Helper not found' });
      }

      const experience = await prisma.helperCareExperience.create({
        data: {
          helperId: helper.id,
          targetType,
          yearsExperience,
        },
      });

      res.status(201).json(experience);
    } catch (error) {
      console.error('Add care experience error:', error);
      res.status(500).json({ error: 'Failed to add experience' });
    }
  }
);

// GET /api/helpers/care-experience - Get care experience
router.get(
  '/care-experience',
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const helper = await prisma.helper.findUnique({
        where: { userId: req.user.id },
      });

      if (!helper) {
        return res.status(404).json({ error: 'Helper not found' });
      }

      const experience = await prisma.helperCareExperience.findMany({
        where: { helperId: helper.id },
      });

      res.json(experience);
    } catch (error) {
      console.error('Get care experience error:', error);
      res.status(500).json({ error: 'Failed to get experience' });
    }
  }
);

// GET /api/helpers/applications - Get helper's job applications/matches
router.get(
  '/applications',
  authenticate,
  requireRole('helper'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const helper = await prisma.helper.findUnique({
        where: { userId: req.user.id },
      });

      if (!helper) {
        return res.status(404).json({ error: 'Helper not found' });
      }

      const applications = await prisma.match.findMany({
        where: { helperId: helper.id },
        include: {
          job: {
            include: {
              employer: {
                include: {
                  user: {
                    select: { email: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(applications);
    } catch (error) {
      console.error('Get applications error:', error);
      res.status(500).json({ error: 'Failed to get applications' });
    }
  }
);

// GET /api/helpers/explore - Browse available jobs
router.get('/explore', authenticate, requireRole('helper'), async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { page = 1, limit = 20, location, salaryMin, salaryMax } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Filter active jobs
    let where: any = {
      status: 'active',
      matches: {
        none: {
          helperId: (
            await prisma.helper.findUnique({
              where: { userId: req.user.id },
              select: { id: true },
            })
          )?.id,
        },
      },
    };

    // Apply additional filters if provided
    if (location) {
      where.employer = {
        location: {
          contains: location as string,
          mode: 'insensitive',
        },
      };
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            location: true,
            householdSize: true,
            children: true,
            hasElderly: true,
            languagePreferences: true,
          },
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
    console.error('Explore jobs error:', error);
    res.status(500).json({ error: 'Failed to explore jobs' });
  }
});

// POST /api/helpers/apply - Apply for a job
router.post(
  '/apply/:jobId',
  authenticate,
  requireRole('helper'),
  async (req: AuthRequest, res) => {
    try {
      const { jobId } = req.params;
      const { notes } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const helper = await prisma.helper.findUnique({
        where: { userId: req.user.id },
      });

      if (!helper) {
        return res.status(404).json({ error: 'Helper not found' });
      }

      const job = await prisma.job.findUnique({
        where: { id: jobId as string },
      });

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Check if already applied
      const existing = await prisma.match.findUnique({
        where: {
          jobId_helperId: {
            jobId: jobId as string,
            helperId: helper.id,
          },
        },
      });

      if (existing) {
        return res.status(409).json({ error: 'Already applied for this job' });
      }

      // Create match with score based on basic compatibility
      const match = await prisma.match.create({
        data: {
          jobId: jobId as string,
          helperId: helper.id,
          sourceType: 'helper_applied',
          matchScore: 75, // Base score for helper-initiated applications
          notes,
          matchBreakdown: {
            source: 'helper_applied',
            timestamp: new Date().toISOString(),
          },
        },
      });

      res.status(201).json(match);
    } catch (error) {
      console.error('Apply for job error:', error);
      res.status(500).json({ error: 'Failed to apply for job' });
    }
  }
);

// GET /api/helpers/stats - Get helper statistics
router.get(
  '/stats',
  authenticate,
  requireRole('helper'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const helper = await prisma.helper.findUnique({
        where: { userId: req.user.id },
      });

      if (!helper) {
        return res.status(404).json({ error: 'Helper not found' });
      }

      const [totalApplications, shortlistedCount, interviewCount, hiredCount] =
        await Promise.all([
          prisma.match.count({
            where: { helperId: helper.id },
          }),
          prisma.match.count({
            where: { helperId: helper.id, status: 'shortlisted' },
          }),
          prisma.match.count({
            where: { helperId: helper.id, status: 'interviewed' },
          }),
          prisma.match.count({
            where: { helperId: helper.id, status: 'hired' },
          }),
        ]);

      res.json({
        totalApplications,
        shortlistedCount,
        interviewCount,
        hiredCount,
      });
    } catch (error) {
      console.error('Get helper stats error:', error);
      res.status(500).json({ error: 'Failed to get statistics' });
    }
  }
);

// GET /:id - Get public helper profile (Public)
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id as string;

    const helper = await prisma.helper.findUnique({
      where: { id },
      include: {
        skills: true,
        careExperience: true,
        // Don't include user (email/phone) for public view unless unlocked
      },
    });

    if (!helper) {
      return res.status(404).json({ error: 'Helper not found' });
    }

    res.json(helper);
  } catch (error) {
    console.error('Get public helper profile error:', error);
    res.status(500).json({ error: 'Failed to get helper profile' });
  }
});

export default router;
