/*
  # ZeroWasteConnect Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `name` (text)
      - `user_type` (text: 'donor', 'receiver', 'admin')
      - `phone` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `address` (text)
      - `organization_type` (text, nullable: 'hotel', 'event', 'household', 'ngo', 'individual')
      - `verified` (boolean, default false)
      - `created_at` (timestamptz)

    - `donations`
      - `id` (uuid, primary key)
      - `donor_id` (uuid, references profiles)
      - `item_name` (text)
      - `quantity` (text)
      - `description` (text)
      - `food_type` (text: 'veg', 'non-veg', 'vegan')
      - `expiry_time` (timestamptz)
      - `image_url` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `address` (text)
      - `status` (text: 'pending', 'collected', 'delivered', 'expired')
      - `receiver_id` (uuid, nullable, references profiles)
      - `pickup_time` (timestamptz, nullable)
      - `qr_code` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `collection_logs`
      - `id` (uuid, primary key)
      - `donation_id` (uuid, references donations)
      - `receiver_id` (uuid, references profiles)
      - `collected_at` (timestamptz)
      - `notes` (text, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for viewing nearby donations
    - Add admin-specific policies
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('donor', 'receiver', 'admin')),
  phone text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  address text,
  organization_type text CHECK (organization_type IN ('hotel', 'event', 'household', 'canteen', 'ngo', 'individual', 'community')),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  quantity text NOT NULL,
  description text,
  food_type text NOT NULL CHECK (food_type IN ('veg', 'non-veg', 'vegan')),
  expiry_time timestamptz NOT NULL,
  image_url text,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  address text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'collected', 'delivered', 'expired')),
  receiver_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  pickup_time timestamptz,
  qr_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create collection logs table
CREATE TABLE IF NOT EXISTS collection_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  collected_at timestamptz DEFAULT now(),
  notes text
);

ALTER TABLE collection_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Donations policies
CREATE POLICY "Anyone can view active donations"
  ON donations FOR SELECT
  TO authenticated
  USING (status IN ('pending', 'collected'));

CREATE POLICY "Donors can create donations"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = donor_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type IN ('donor', 'admin'))
  );

CREATE POLICY "Donors can update own donations"
  ON donations FOR UPDATE
  TO authenticated
  USING (auth.uid() = donor_id)
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Receivers can update donation status"
  ON donations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type IN ('receiver', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type IN ('receiver', 'admin'))
  );

-- Collection logs policies
CREATE POLICY "Users can view their collection logs"
  ON collection_logs FOR SELECT
  TO authenticated
  USING (
    auth.uid() = receiver_id OR
    auth.uid() IN (SELECT donor_id FROM donations WHERE id = donation_id)
  );

CREATE POLICY "Receivers can create collection logs"
  ON collection_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = receiver_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type IN ('receiver', 'admin'))
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_location ON donations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_receiver ON donations(receiver_id);
CREATE INDEX IF NOT EXISTS idx_profiles_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(latitude, longitude);