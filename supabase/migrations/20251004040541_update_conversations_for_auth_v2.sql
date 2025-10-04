/*
  # Update conversations table for Supabase Auth

  1. Changes
    - Drop and recreate user_id column as uuid to match Supabase auth.users
    - Drop existing RLS policies
    - Create new RLS policies using auth.uid() for proper user isolation
    - Ensure each user can only access their own conversations

  2. Security
    - RLS policies now use auth.uid() instead of hardcoded values
    - Each user can only view, insert, update, and delete their own conversations
    - Authenticated users only - no anonymous access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can insert their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON conversations;

-- Drop existing index
DROP INDEX IF EXISTS idx_conversations_user_id;

-- Drop and recreate user_id column as uuid
ALTER TABLE conversations DROP COLUMN user_id;
ALTER TABLE conversations ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create new policies with auth.uid()
CREATE POLICY "Users can view their own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON conversations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Recreate index
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
