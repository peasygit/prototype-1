import { Helper, Job, Employer } from '@prisma/client';

// Western Zodiac calculation
function getWesternZodiac(birthdate: Date): string {
  const month = birthdate.getMonth() + 1;
  const day = birthdate.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
}

// Get Zodiac Element
function getZodiacElement(zodiac: string): string {
  const fire = ['aries', 'leo', 'sagittarius'];
  const earth = ['taurus', 'virgo', 'capricorn'];
  const air = ['gemini', 'libra', 'aquarius'];
  const water = ['cancer', 'scorpio', 'pisces'];

  if (fire.includes(zodiac)) return 'fire';
  if (earth.includes(zodiac)) return 'earth';
  if (air.includes(zodiac)) return 'wood'; // Air maps to Wood (Adaptation)
  return 'water';
}

// Wuxing calculation based on year
function getWuxingByYear(year: number): string {
  const lastDigit = year % 10;
  const mapping: { [key: number]: string } = {
    0: 'metal', 1: 'metal',
    2: 'water', 3: 'water',
    4: 'wood', 5: 'wood',
    6: 'fire', 7: 'fire',
    8: 'earth', 9: 'earth'
  };
  return mapping[lastDigit];
}

// Calculate element relationship
function getElementRelation(element1: string, element2: string): string {
  if (element1 === element2) return 'same';

  const generate: { [key: string]: string } = {
    'water': 'wood',
    'wood': 'fire',
    'fire': 'earth',
    'earth': 'metal',
    'metal': 'water'
  };

  const overcome: { [key: string]: string } = {
    'water': 'fire',
    'fire': 'metal',
    'metal': 'wood',
    'wood': 'earth',
    'earth': 'water'
  };

  if (generate[element1] === element2) return 'generate';
  if (overcome[element1] === element2) return 'overcome';
  return 'neutral';
}

// Calculate element bonus
function calculateElementBonus(employerElement: string, helperElement: string): number {
  const relation = getElementRelation(employerElement, helperElement);

  switch (relation) {
    case 'generate': return 5;
    case 'same': return 3;
    case 'overcome': return -2;
    default: return 0;
  }
}

// Calculate zodiac bonus
function calculateZodiacBonus(employerZodiac: string, helperZodiac: string): number {
  const employerElement = getZodiacElement(employerZodiac);
  const helperElement = getZodiacElement(helperZodiac);

  if (employerElement === helperElement) return 5;

  // Complementary elements
  if ((employerElement === 'fire' && helperElement === 'wood') ||
      (employerElement === 'wood' && helperElement === 'fire') ||
      (employerElement === 'earth' && helperElement === 'water') ||
      (employerElement === 'water' && helperElement === 'earth')) {
    return 3;
  }

  return 0;
}

// Main matching function
export async function calculateMatchScore(helper: any, job: any, employer: any): Promise<{
  totalScore: number;
  breakdown: {
    skill: number;
    experience: number;
    preference: number;
    language: number;
    availability: number;
    elementBonus: number;
    zodiacBonus: number;
  }
}> {
  let skillScore = 0;        // Max 40
  let experienceScore = 0;   // Max 20
  let preferenceScore = 0;   // Max 15
  let languageScore = 0;     // Max 10
  let availabilityScore = 0; // Max 5
  let elementBonus = 0;      // Max 5
  let zodiacBonus = 0;       // Max 5

  const jobDuties = Array.isArray(job.duties)
    ? job.duties.filter(Boolean)
    : typeof job.duties === 'string'
      ? [job.duties]
      : job.duties && typeof job.duties === 'object'
        ? Object.entries(job.duties).flatMap(([key, value]) => {
            if (value === true) return [key];
            if (typeof value === 'string') return [value];
            if (typeof value === 'number') return [String(value)];
            return [];
          }).filter(Boolean)
        : [];
  const employerLanguages = employer.languagePreferences || [];
  const employerTraits = employer.preferredHelperTraits || [];

  // 1. Skill Score (40%)
  const helperSkills = helper.skills?.map((s: any) => s.skillType) || [];
  const helperCareExperience = helper.careExperience?.map((c: any) => c.targetType) || [];

  for (const duty of jobDuties) {
    if (helperSkills.includes(duty)) {
      skillScore += 10;
    } else if (helperSkills.includes(duty.replace('_', ''))) {
      skillScore += 5;
    }
  }

  // Care experience matching
  const hasChildCareDuty = jobDuties.some((d: string) => 
    d.includes('child') || d.includes('infant') || d.includes('baby') || d.includes('kid') || d.includes('toddler')
  );
  if ((employer.hasChildren || hasChildCareDuty) && helperCareExperience.some((c: string) => c.includes('child') || c.includes('infant'))) {
    skillScore += 10;
  }

  const hasElderlyCareDuty = jobDuties.some((d: string) => 
    d.includes('elderly') || d.includes('senior') || d.includes('grandma') || d.includes('grandpa')
  );
  if ((employer.hasElderly || hasElderlyCareDuty) && helperCareExperience.some((c: string) => c.includes('elderly'))) {
    skillScore += 10;
  }

  skillScore = Math.min(skillScore, 40);

  // 2. Experience Score (20%)
  const preferredYears = job.preferredExperienceYears || 0;
  const helperTotalYears = helper.yearsExperienceTotal || 0;
  const helperLocalYears = helper.yearsExperienceLocal || 0;

  if (preferredYears > 0) {
    if (helperTotalYears >= preferredYears) {
      experienceScore += 10;
    } else if (helperTotalYears >= preferredYears * 0.7) {
      experienceScore += 5;
    }

    if (helperLocalYears >= 2) {
      experienceScore += 10;
    } else if (helperLocalYears >= 1) {
      experienceScore += 5;
    }
  } else {
    experienceScore = 20; // No preference means full points
  }

  experienceScore = Math.min(experienceScore, 20);

  // 3. Preference Score (15%)
  const helperTraits = helper.personalityTraits || [];
  let traitMatches = 0;
  for (const trait of employerTraits) {
    if (helperTraits.includes(trait)) {
      traitMatches++;
    }
  }
  preferenceScore = Math.min(traitMatches * 5, 15);

  // 4. Language Score (10%)
  const helperLanguages = helper.languages || [];
  const helperLangs = Array.isArray(helperLanguages)
    ? helperLanguages.map((l: any) => (typeof l === 'string' ? l : l?.lang)).filter(Boolean)
    : [];
  let langMatches = 0;
  for (const lang of employerLanguages) {
    if (helperLangs.includes(lang)) {
      langMatches++;
    }
  }
  languageScore = Math.min(langMatches * 5, 10);

  // 5. Availability Score (5%)
  const jobStartDate = new Date(job.preferredStartDate);
  const helperAvailableFrom = new Date(helper.availableFrom);
  const diffMonths = Math.abs(
    (jobStartDate.getFullYear() - helperAvailableFrom.getFullYear()) * 12 +
    (jobStartDate.getMonth() - helperAvailableFrom.getMonth())
  );

  if (diffMonths <= 1) {
    availabilityScore = 5;
  } else if (diffMonths <= 3) {
    availabilityScore = 2;
  }

  // 6. Element Bonus (5%)
  if (employer.wuxingElement && helper.wuxingElement) {
    elementBonus = calculateElementBonus(employer.wuxingElement, helper.wuxingElement);
  }

  // 7. Zodiac Bonus (5%)
  if (employer.westernZodiac && helper.westernZodiac) {
    zodiacBonus = calculateZodiacBonus(employer.westernZodiac, helper.westernZodiac);
  }

  const totalScore = Math.round(
    (skillScore +
    experienceScore +
    preferenceScore +
    languageScore +
    availabilityScore +
    elementBonus +
    zodiacBonus) * 100
  ) / 100;

  return {
    totalScore: Math.max(0, totalScore),
    breakdown: {
      skill: skillScore,
      experience: experienceScore,
      preference: preferenceScore,
      language: languageScore,
      availability: availabilityScore,
      elementBonus,
      zodiacBonus
    }
  };
}

// Auto-populate wuxing and zodiac for a user
export function calculateProfileMeta(birthdate: Date): {
  westernZodiac: string;
  wuxingElement: string;
} {
  return {
    westernZodiac: getWesternZodiac(birthdate),
    wuxingElement: getWuxingByYear(birthdate.getFullYear())
  };
}
