-- Add permissions column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;

-- Add user_type column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS user_type VARCHAR(20) DEFAULT 'client';

-- Add index for faster permission lookups
CREATE INDEX IF NOT EXISTS idx_users_permissions ON users USING GIN (permissions);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);

-- Update existing users to have default permissions based on type
UPDATE users 
SET permissions = '["dashboard.view", "contacts.view", "calls.view", "deals.view", "pipeline.view", "financials.view"]'::jsonb
WHERE user_type = 'client' AND (permissions IS NULL OR permissions = '[]'::jsonb);

UPDATE users 
SET permissions = '"all"'::jsonb
WHERE user_type = 'admin';

-- Add comment for documentation
COMMENT ON COLUMN users.permissions IS 'Granular permissions array or "all" for admin';
COMMENT ON COLUMN users.user_type IS 'User role: admin, manager, or client';
