-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('employer', 'helper', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'suspended', 'inactive');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('finishing', 'early_termination', 'transfer', 'freelance', 'overseas');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('active', 'filled', 'closed');

-- CreateEnum
CREATE TYPE "MatchSource" AS ENUM ('auto_match', 'helper_applied', 'admin_recommended');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('pending', 'shortlisted', 'interviewed', 'hired', 'rejected');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('day_7', 'day_30', 'day_60');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'expired', 'cancelled');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "householdSize" INTEGER,
    "adults" INTEGER,
    "children" INTEGER,
    "childrenAges" JSONB,
    "hasElderly" BOOLEAN NOT NULL DEFAULT false,
    "elderlyCareNeeds" JSONB,
    "location" TEXT,
    "languagePreferences" JSONB,
    "preferredHelperTraits" JSONB,
    "householdRules" TEXT,
    "preferredStartDate" TIMESTAMP(3),
    "birthdate" TIMESTAMP(3),
    "wuxingElement" TEXT,
    "westernZodiac" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Helper" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "displayName" TEXT,
    "nationality" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "religion" TEXT,
    "currentLocation" TEXT NOT NULL,
    "contractStatus" "ContractStatus" NOT NULL,
    "availableFrom" TIMESTAMP(3),
    "yearsExperienceTotal" INTEGER NOT NULL,
    "yearsExperienceLocal" INTEGER NOT NULL,
    "educationLevel" TEXT,
    "languages" JSONB,
    "aboutMe" TEXT,
    "profilePhotoUrl" TEXT,
    "expectedSalaryMin" INTEGER,
    "expectedSalaryMax" INTEGER,
    "personalityTraits" JSONB,
    "workStylePreference" TEXT,
    "cannotAccept" JSONB,
    "wuxingElement" TEXT,
    "westernZodiac" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Helper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelperSkill" (
    "id" TEXT NOT NULL,
    "helperId" TEXT NOT NULL,
    "skillType" TEXT NOT NULL,
    "proficiencyLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HelperSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelperCareExperience" (
    "id" TEXT NOT NULL,
    "helperId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HelperCareExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "duties" JSONB,
    "preferredExperienceYears" INTEGER,
    "preferredLanguages" JSONB,
    "preferredStartDate" TIMESTAMP(3),
    "salaryRange" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "helperId" TEXT NOT NULL,
    "sourceType" "MatchSource" NOT NULL DEFAULT 'auto_match',
    "matchScore" DOUBLE PRECISION NOT NULL,
    "matchBreakdown" JSONB,
    "status" "MatchStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planType" "PlanType" NOT NULL,
    "stripePaymentId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'HKD',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employer_userId_key" ON "Employer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Helper_userId_key" ON "Helper"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HelperSkill_helperId_skillType_key" ON "HelperSkill"("helperId", "skillType");

-- CreateIndex
CREATE UNIQUE INDEX "Match_jobId_helperId_key" ON "Match"("jobId", "helperId");

-- AddForeignKey
ALTER TABLE "Employer" ADD CONSTRAINT "Employer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Helper" ADD CONSTRAINT "Helper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelperSkill" ADD CONSTRAINT "HelperSkill_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "Helper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelperCareExperience" ADD CONSTRAINT "HelperCareExperience_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "Helper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "Helper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
