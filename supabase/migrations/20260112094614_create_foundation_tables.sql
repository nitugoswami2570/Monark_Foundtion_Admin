/*
  # Monark Foundation Database Schema

  1. New Tables
    - `donations`
      - `id` (uuid, primary key)
      - `donor_name` (text)
      - `donor_email` (text)
      - `donor_phone` (text)
      - `amount` (decimal)
      - `payment_method` (text)
      - `status` (text)
      - `message` (text)
      - `created_at` (timestamptz)
    
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `goal_amount` (decimal)
      - `raised_amount` (decimal)
      - `status` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `image_url` (text)
      - `created_at` (timestamptz)
    
    - `volunteers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `skills` (text)
      - `availability` (text)
      - `status` (text)
      - `created_at` (timestamptz)
    
    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `subject` (text)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (for admin panel)
*/

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  donor_phone text,
  amount decimal NOT NULL,
  payment_method text DEFAULT 'Cash',
  status text DEFAULT 'Completed',
  message text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  goal_amount decimal NOT NULL,
  raised_amount decimal DEFAULT 0,
  status text DEFAULT 'Active',
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  skills text,
  availability text,
  status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'New',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to donations"
  ON donations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to donations"
  ON donations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to donations"
  ON donations FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from donations"
  ON donations FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to projects"
  ON projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to projects"
  ON projects FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to projects"
  ON projects FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from projects"
  ON projects FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to volunteers"
  ON volunteers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to volunteers"
  ON volunteers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to volunteers"
  ON volunteers FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from volunteers"
  ON volunteers FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to contacts"
  ON contacts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to contacts"
  ON contacts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to contacts"
  ON contacts FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from contacts"
  ON contacts FOR DELETE
  TO public
  USING (true);

INSERT INTO projects (title, description, goal_amount, raised_amount, status) VALUES
('Education for All', 'Providing quality education to underprivileged children', 100000, 45000, 'Active'),
('Clean Water Initiative', 'Installing water purification systems in rural areas', 75000, 32000, 'Active'),
('Healthcare Outreach', 'Free medical camps and healthcare services', 50000, 48000, 'Active');

INSERT INTO donations (donor_name, donor_email, amount, payment_method, status) VALUES
('John Smith', 'john@example.com', 5000, 'Credit Card', 'Completed'),
('Sarah Johnson', 'sarah@example.com', 10000, 'Bank Transfer', 'Completed'),
('Michael Brown', 'michael@example.com', 2500, 'Cash', 'Completed');

INSERT INTO volunteers (name, email, phone, skills, status) VALUES
('Emily Davis', 'emily@example.com', '+1234567890', 'Teaching, Community Outreach', 'Approved'),
('Robert Wilson', 'robert@example.com', '+1234567891', 'Medical, First Aid', 'Approved'),
('Lisa Anderson', 'lisa@example.com', '+1234567892', 'Event Management', 'Pending');

INSERT INTO contacts (name, email, phone, subject, message, status) VALUES
('David Lee', 'david@example.com', '+1234567893', 'Partnership Inquiry', 'Interested in collaborating on education projects', 'New'),
('Maria Garcia', 'maria@example.com', '+1234567894', 'Donation Question', 'How can I set up monthly donations?', 'New');