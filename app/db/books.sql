CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  author VARCHAR(500),
  genre VARCHAR(255),
  published_date VARCHAR(50),
  page_count INTEGER,
  description TEXT,
  image_url TEXT,
  affiliated_link TEXT,
  foreign_id VARCHAR(255) UNIQUE,
  is_google_books BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
