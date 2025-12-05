-- Drop the access_level column and add temp_password column
ALTER TABLE client_invitations
  DROP COLUMN IF EXISTS access_level,
  ADD COLUMN IF NOT EXISTS temp_password TEXT NOT NULL;

-- Add a check constraint to ensure temp_password is not empty
ALTER TABLE client_invitations
  ADD CONSTRAINT temp_password_not_empty CHECK (temp_password <> '');