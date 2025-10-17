-- Chatbot Knowledge Base Table
CREATE TABLE IF NOT EXISTS chatbot_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[], -- Array of keywords for better matching
  priority INTEGER DEFAULT 0, -- Higher priority answers shown first
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index for faster searches
CREATE INDEX IF NOT EXISTS idx_kb_category ON chatbot_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_kb_keywords ON chatbot_knowledge_base USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_kb_active ON chatbot_knowledge_base(is_active);

-- RLS Policies
ALTER TABLE chatbot_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Anyone can read active knowledge base entries
CREATE POLICY "Public can read active KB entries"
  ON chatbot_knowledge_base FOR SELECT
  USING (is_active = true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can manage KB entries"
  ON chatbot_knowledge_base FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
