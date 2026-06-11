-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  year TEXT,
  description TEXT,
  full_description TEXT,
  image TEXT,
  tech TEXT[] DEFAULT '{}',
  color TEXT DEFAULT '#6366F1',
  platforms TEXT[] DEFAULT '{}',
  repo_link TEXT,
  project_link TEXT,
  more_info_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (Select)
CREATE POLICY "Allow public read access to projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to experiences" ON experiences
  FOR SELECT USING (true);

-- Create policies for admin modification (all operations for authenticated users or custom token)
-- For simplicity, if they authenticate with standard Supabase Auth, they can perform CRUD:
CREATE POLICY "Allow all operations for authenticated users on projects" ON projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users on experiences" ON experiences
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
