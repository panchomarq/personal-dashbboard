-- Create a new categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'expense' or 'income' or 'both'
  color VARCHAR(7) DEFAULT '#3E3F5B',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add a description column to expenses table
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Insert default categories
INSERT INTO categories (name, type, color) VALUES
  ('Food', 'expense', '#8AB2A6'),
  ('Housing', 'expense', '#3E3F5B'),
  ('Transportation', 'expense', '#F6F1DE'),
  ('Entertainment', 'expense', '#ACD3A8'),
  ('Utilities', 'expense', '#3E3F5B'),
  ('Healthcare', 'expense', '#8AB2A6'),
  ('Salary', 'income', '#ACD3A8'),
  ('Investment', 'income', '#3E3F5B'),
  ('Freelance', 'income', '#8AB2A6'),
  ('Other', 'both', '#F6F1DE');

-- Create a foreign key column in expenses (initially nullable)
ALTER TABLE expenses
ADD COLUMN IF NOT EXISTS category_id INTEGER;

-- Update category_id based on category name
UPDATE expenses 
SET category_id = (
  SELECT id FROM categories 
  WHERE categories.name = expenses.category
  LIMIT 1
);

-- If income table exists, apply the same changes
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'incomes') THEN
    -- Add description column to incomes
    ALTER TABLE incomes
    ADD COLUMN IF NOT EXISTS description TEXT;
    
    -- Add category_id to incomes
    ALTER TABLE incomes
    ADD COLUMN IF NOT EXISTS category_id INTEGER;
    
    -- Update category_id based on category name
    UPDATE incomes
    SET category_id = (
      SELECT id FROM categories 
      WHERE categories.name = incomes.category
      LIMIT 1
    );
  END IF;
END $$; 