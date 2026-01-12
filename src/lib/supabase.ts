import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  payment_method: string;
  status: string;
  message?: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  status: string;
  start_date: string;
  end_date?: string;
  image_url?: string;
  created_at: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills?: string;
  availability?: string;
  status: string;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}
