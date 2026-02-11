-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enums (PostgreSQL Enums)
CREATE TYPE user_role AS ENUM ('employer', 'helper', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'inactive');
CREATE TYPE contract_status AS ENUM ('finishing', 'early_termination', 'transfer', 'freelance', 'overseas');
CREATE TYPE job_status AS ENUM ('active', 'filled', 'closed');
CREATE TYPE match_source AS ENUM ('auto_match', 'helper_applied', 'admin_recommended');
CREATE TYPE match_status AS ENUM ('pending', 'shortlisted', 'interviewed', 'hired', 'rejected');
CREATE TYPE plan_type AS ENUM ('day_7', 'day_30', 'day_60');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled');

-- Create Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  status user_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Employers Table
CREATE TABLE employers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  household_size INTEGER,
  adults INTEGER,
  children INTEGER,
  children_ages JSONB,
  has_elderly BOOLEAN DEFAULT FALSE,
  elderly_care_needs JSONB,
  location TEXT,
  language_preferences JSONB,
  preferred_helper_traits JSONB,
  household_rules TEXT,
  preferred_start_date TIMESTAMP WITH TIME ZONE,
  birthdate TIMESTAMP WITH TIME ZONE,
  wuxing_element TEXT,
  western_zodiac TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Helpers Table
CREATE TABLE helpers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  display_name TEXT,
  nationality TEXT NOT NULL,
  birthdate TIMESTAMP WITH TIME ZONE NOT NULL,
  religion TEXT,
  current_location TEXT NOT NULL,
  contract_status contract_status NOT NULL,
  available_from TIMESTAMP WITH TIME ZONE,
  years_experience_total INTEGER NOT NULL,
  years_experience_local INTEGER NOT NULL,
  education_level TEXT,
  languages JSONB,
  about_me TEXT,
  profile_photo_url TEXT,
  expected_salary_min INTEGER,
  expected_salary_max INTEGER,
  personality_traits JSONB,
  work_style_preference TEXT,
  cannot_accept JSONB,
  wuxing_element TEXT,
  western_zodiac TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Helper Skills Table
CREATE TABLE helper_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  helper_id UUID NOT NULL REFERENCES helpers(id) ON DELETE CASCADE,
  skill_type TEXT NOT NULL,
  proficiency_level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(helper_id, skill_type)
);

-- Create Helper Care Experience Table
CREATE TABLE helper_care_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  helper_id UUID NOT NULL REFERENCES helpers(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  years_experience INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Jobs Table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  duties JSONB,
  preferred_experience_years INTEGER,
  preferred_languages JSONB,
  preferred_start_date TIMESTAMP WITH TIME ZONE,
  salary_range TEXT,
  status job_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Matches Table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  helper_id UUID NOT NULL REFERENCES helpers(id) ON DELETE CASCADE,
  source_type match_source DEFAULT 'auto_match',
  match_score DOUBLE PRECISION NOT NULL,
  match_breakdown JSONB,
  status match_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, helper_id)
);

-- Create Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_type plan_type NOT NULL,
  stripe_payment_id TEXT,
  amount DOUBLE PRECISION NOT NULL,
  currency TEXT DEFAULT 'HKD',
  status subscription_status DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - Basic Policy (Allow all for prototype)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpers ENABLE ROW LEVEL SECURITY;
ALTER TABLE helper_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE helper_care_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (for now, can be restricted later)
CREATE POLICY "Public access for users" ON users FOR ALL USING (true);
CREATE POLICY "Public access for employers" ON employers FOR ALL USING (true);
CREATE POLICY "Public access for helpers" ON helpers FOR ALL USING (true);
CREATE POLICY "Public access for helper_skills" ON helper_skills FOR ALL USING (true);
CREATE POLICY "Public access for helper_care_experiences" ON helper_care_experiences FOR ALL USING (true);
CREATE POLICY "Public access for jobs" ON jobs FOR ALL USING (true);
CREATE POLICY "Public access for matches" ON matches FOR ALL USING (true);
CREATE POLICY "Public access for subscriptions" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Public access for events" ON events FOR ALL USING (true);
