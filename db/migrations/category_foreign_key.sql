- Migration to update the category column in expenses table to be a foreign key reference

-- First ensure category_id exists and is populated
ALTER TABLE expenses
ADD COLUMN IF NOT EXISTS category_id INTEGER;

-- Update any null category_id values based on category name
UPDATE expenses 
SET category_id = (
  SELECT id FROM categories 
  WHERE categories.name = expenses.category
  LIMIT 1
)
WHERE category_id IS NULL AND category IS NOT NULL;

-- Add a foreign key constraint to category_id
ALTER TABLE expenses
ADD CONSTRAINT fk_expenses_category
FOREIGN KEY (category_id) 
REFERENCES categories(id)
ON DELETE SET NULL;

-- Add an index on category_id for faster joins
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);

-- Do the same for incomes table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'incomes') THEN
    -- Ensure category_id exists 
    ALTER TABLE incomes
    ADD COLUMN IF NOT EXISTS category_id INTEGER;
    
    -- Update any null category_id values
    UPDATE incomes 
    SET category_id = (
      SELECT id FROM categories 
      WHERE categories.name = incomes.category
      LIMIT 1
    )
    WHERE category_id IS NULL AND category IS NOT NULL;
    
    -- Add a foreign key constraint
    ALTER TABLE incomes
    ADD CONSTRAINT fk_incomes_category
    FOREIGN KEY (category_id) 
    REFERENCES categories(id)
    ON DELETE SET NULL;
    
    -- Add an index for faster joins
    CREATE INDEX IF NOT EXISTS idx_incomes_category_id ON incomes(category_id);
  END IF;
END $$;