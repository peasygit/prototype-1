import { PrismaClient, UserRole, UserStatus, ContractStatus } from '@prisma/client';
import { generateReadableId } from '../src/utils/idGenerator';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding ...');

  // Create password hash
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@peasy.com' },
    update: {},
    create: {
      email: 'admin@peasy.com',
      passwordHash,
      role: UserRole.admin,
      status: UserStatus.active,
    },
  });
  console.log(`Created user: ${admin.email}`);

  // 2. Create Employer User & Profile
  const employerUser = await prisma.user.upsert({
    where: { email: 'employer@example.com' },
    update: {},
    create: {
      email: 'employer@example.com',
      passwordHash,
      role: UserRole.employer,
      status: UserStatus.active,
      employer: {
        create: {
          readableId: generateReadableId('employer'),
          name: 'John Doe Family',
          location: 'Central, Hong Kong',
          householdSize: 4,
          children: 2,
          childrenAges: [3, 5],
          hasElderly: false,
          householdRules: 'No smoking, must love dogs.',
        },
      },
    },
  });
  console.log(`Created user: ${employerUser.email}`);

  // 3. Create Helper User & Profile
  const helperUser = await prisma.user.upsert({
    where: { email: 'helper@example.com' },
    update: {},
    create: {
      email: 'helper@example.com',
      passwordHash,
      role: UserRole.helper,
      status: UserStatus.active,
      helper: {
        create: {
          readableId: generateReadableId('helper'),
          fullName: 'Maria Santos',
          displayName: 'Maria',
          nationality: 'Philippines',
          birthdate: new Date('1990-05-15'),
          currentLocation: 'Hong Kong',
          contractStatus: ContractStatus.finishing,
          yearsExperienceTotal: 5,
          yearsExperienceLocal: 3,
          educationLevel: 'High School',
          languages: ['English', 'Tagalog'],
          aboutMe: 'Hardworking and experienced helper with 5 years of experience in child care.',
          skills: {
            create: [
              { skillType: 'Child Care', proficiencyLevel: 'Expert' },
              { skillType: 'Cooking', proficiencyLevel: 'Intermediate' },
              { skillType: 'Cleaning', proficiencyLevel: 'Expert' },
            ],
          },
        },
      },
    },
  });
  console.log(`Created user: ${helperUser.email}`);

  // 4. Create a Job for the Employer
  if (employerUser) {
    const employer = await prisma.employer.findUnique({ where: { userId: employerUser.id } });
    if (employer) {
      await prisma.job.create({
        data: {
          employerId: employer.id,
          title: 'Full-time Helper for Family of 4',
          description: 'Looking for an experienced helper to take care of 2 kids and do household chores.',
          salaryRange: '5000-6000',
          preferredExperienceYears: 2,
          preferredStartDate: new Date(),
        },
      });
      console.log('Created job for employer');
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
