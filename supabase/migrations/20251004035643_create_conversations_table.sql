/*
  # Create conversations table for chat storage

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key) - Unique identifier for each conversation
      - `user_id` (text) - User identifier (for future auth integration)
      - `title` (text) - Conversation title
      - `messages` (jsonb) - Array of messages in the conversation
      - `created_at` (timestamptz) - When the conversation was created
      - `updated_at` (timestamptz) - When the conversation was last updated

  2. Security
    - Enable RLS on `conversations` table
    - Add policy for users to manage their own conversations
    - For now, allow all operations since auth is not yet implemented

  3. Indexes
    - Index on user_id for fast lookup
    - Index on updated_at for sorting
*/

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL DEFAULT 'default-user',
  title text NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON conversations
  FOR SELECT
  USING (user_id = 'default-user');

CREATE POLICY "Users can insert their own conversations"
  ON conversations
  FOR INSERT
  WITH CHECK (user_id = 'default-user');

CREATE POLICY "Users can update their own conversations"
  ON conversations
  FOR UPDATE
  USING (user_id = 'default-user')
  WITH CHECK (user_id = 'default-user');

CREATE POLICY "Users can delete their own conversations"
  ON conversations
  FOR DELETE
  USING (user_id = 'default-user');

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
