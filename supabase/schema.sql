-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries_078be9eb (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  project_type TEXT,
  configuration TEXT,
  budget TEXT,
  timeline TEXT,
  design_style TEXT,
  message TEXT,
  source TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs_078be9eb (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  author TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'draft',
  read_time TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Create homes/portfolio table
CREATE TABLE IF NOT EXISTS homes_078be9eb (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  area TEXT NOT NULL,
  style TEXT NOT NULL,
  description TEXT,
  gallery_images TEXT[],
  status TEXT DEFAULT 'published',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries_078be9eb(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries_078be9eb(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs_078be9eb(status);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs_078be9eb(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs_078be9eb(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_homes_status ON homes_078be9eb(status);
CREATE INDEX IF NOT EXISTS idx_homes_order ON homes_078be9eb(display_order);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE enquiries_078be9eb ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs_078be9eb ENABLE ROW LEVEL SECURITY;
ALTER TABLE homes_078be9eb ENABLE ROW LEVEL SECURITY;

-- Create policies to allow service role access (Edge Functions use service role)
CREATE POLICY "Allow service role full access to enquiries" ON enquiries_078be9eb
  FOR ALL USING (true);

CREATE POLICY "Allow service role full access to blogs" ON blogs_078be9eb
  FOR ALL USING (true);

CREATE POLICY "Allow service role full access to homes" ON homes_078be9eb
  FOR ALL USING (true);
