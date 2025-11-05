import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  user_type: 'donor' | 'receiver' | 'admin';
  phone?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  organization_type?: 'hotel' | 'event' | 'household' | 'canteen' | 'ngo' | 'individual' | 'community';
  verified: boolean;
  created_at: string;
};

export type Donation = {
  id: string;
  donor_id: string;
  item_name: string;
  quantity: string;
  description?: string;
  food_type: 'veg' | 'non-veg' | 'vegan';
  expiry_time: string;
  image_url?: string;
  latitude: number;
  longitude: number;
  address: string;
  status: 'pending' | 'collected' | 'delivered' | 'expired';
  receiver_id?: string;
  pickup_time?: string;
  qr_code?: string;
  created_at: string;
  updated_at: string;
  donor?: Profile;
  receiver?: Profile;
};

export type CollectionLog = {
  id: string;
  donation_id: string;
  receiver_id: string;
  collected_at: string;
  notes?: string;
};
