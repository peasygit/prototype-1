
import { randomBytes } from 'crypto';

export function generateReadableId(role: 'employer' | 'helper'): string {
  const prefix = role === 'employer' ? 'EMP' : 'HLP';
  // Generate 6 random digits/characters
  const randomPart = randomBytes(3).toString('hex').toUpperCase(); 
  // Alternatively, just numbers:
  // const randomPart = Math.floor(100000 + Math.random() * 900000).toString();
  
  return `${prefix}-${randomPart}`;
}
