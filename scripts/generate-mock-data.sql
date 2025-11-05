-- Mock Data Generator for ZeroWasteConnect
-- This script creates test users and donations for development

-- Note: You'll need to create users via the Supabase Auth system first
-- Then use their UIDs to create profiles and donations

-- Sample profiles (replace with actual auth user IDs)
-- After signing up users through the app, you can run queries like these:

-- Example INSERT for profiles (after auth users are created):
/*
INSERT INTO profiles (id, name, user_type, phone, latitude, longitude, address, organization_type, verified)
VALUES
  -- Donors around Rajanukunte, Bengaluru
  ('user-id-1', 'Green Valley Hotel', 'donor', '+91-9876543210', 13.1579, 77.5719, 'Green Valley Hotel, Rajanukunte, Bengaluru', 'hotel', true),
  ('user-id-2', 'Happy Events', 'donor', '+91-9876543211', 13.1589, 77.5729, 'Happy Events Hall, Rajanukunte, Bengaluru', 'event', true),
  ('user-id-3', 'Tech Park Canteen', 'donor', '+91-9876543212', 13.1569, 77.5709, 'Tech Park Canteen, Rajanukunte, Bengaluru', 'canteen', true),
  ('user-id-4', 'Community Kitchen', 'donor', '+91-9876543213', 13.1599, 77.5739, 'Community Kitchen, Rajanukunte, Bengaluru', 'household', true),

  -- Receivers around Yelahanka, Bengaluru
  ('user-id-5', 'Helping Hands NGO', 'receiver', '+91-9876543220', 13.1007, 77.5963, 'Helping Hands NGO, Yelahanka, Bengaluru', 'ngo', true),
  ('user-id-6', 'Care Foundation', 'receiver', '+91-9876543221', 13.1017, 77.5973, 'Care Foundation, Yelahanka, Bengaluru', 'ngo', true),
  ('user-id-7', 'Ravi Kumar', 'receiver', '+91-9876543222', 13.0997, 77.5953, 'Yelahanka New Town, Bengaluru', 'individual', true),
  ('user-id-8', 'Community Helpers', 'receiver', '+91-9876543223', 13.1027, 77.5983, 'Community Center, Yelahanka, Bengaluru', 'community', true);
*/

-- Example INSERT for donations (replace donor_id with actual user IDs):
/*
INSERT INTO donations (donor_id, item_name, quantity, description, food_type, expiry_time, latitude, longitude, address, status, qr_code)
VALUES
  -- Pending donations
  ('user-id-1', 'Vegetable Biryani', '30 plates', 'Fresh biryani from lunch buffet, perfectly safe for consumption', 'veg', NOW() + INTERVAL '3 hours', 13.1579, 77.5719, 'Green Valley Hotel, Rajanukunte', 'pending', 'ZWC-001'),
  ('user-id-2', 'Mixed Fruit Platter', '50 servings', 'Fresh fruits from event, well packaged', 'vegan', NOW() + INTERVAL '4 hours', 13.1589, 77.5729, 'Happy Events Hall, Rajanukunte', 'pending', 'ZWC-002'),
  ('user-id-3', 'Rice & Dal Combo', '40 meals', 'Wholesome lunch meals from canteen', 'veg', NOW() + INTERVAL '2 hours', 13.1569, 77.5709, 'Tech Park Canteen, Rajanukunte', 'pending', 'ZWC-003'),
  ('user-id-1', 'Chicken Curry', '20 portions', 'Freshly prepared chicken curry', 'non-veg', NOW() + INTERVAL '3 hours', 13.1579, 77.5719, 'Green Valley Hotel, Rajanukunte', 'pending', 'ZWC-004'),
  ('user-id-4', 'Chapati & Sabzi', '25 sets', 'Home cooked food from community event', 'veg', NOW() + INTERVAL '5 hours', 13.1599, 77.5739, 'Community Kitchen, Rajanukunte', 'pending', 'ZWC-005'),

  -- Collected donations
  ('user-id-2', 'Sandwich Platters', '60 pieces', 'Assorted sandwiches from corporate event', 'veg', NOW() + INTERVAL '2 hours', 13.1589, 77.5729, 'Happy Events Hall, Rajanukunte', 'collected', 'ZWC-006'),
  ('user-id-3', 'Samosa & Chutney', '100 pieces', 'Tea time snacks', 'veg', NOW() + INTERVAL '4 hours', 13.1569, 77.5709, 'Tech Park Canteen, Rajanukunte', 'collected', 'ZWC-007'),

  -- Delivered donations
  ('user-id-1', 'Idli Vada Combo', '50 sets', 'Breakfast items with sambar and chutney', 'veg', NOW() - INTERVAL '1 hour', 13.1579, 77.5719, 'Green Valley Hotel, Rajanukunte', 'delivered', 'ZWC-008'),
  ('user-id-4', 'Pulao & Raita', '35 portions', 'Lunch from community kitchen', 'veg', NOW() - INTERVAL '2 hours', 13.1599, 77.5739, 'Community Kitchen, Rajanukunte', 'delivered', 'ZWC-009'),
  ('user-id-1', 'Masala Dosa', '40 pieces', 'South Indian breakfast', 'veg', NOW() - INTERVAL '3 hours', 13.1579, 77.5719, 'Green Valley Hotel, Rajanukunte', 'delivered', 'ZWC-010');
*/

-- To assign receivers to collected/delivered donations, update them:
/*
UPDATE donations
SET receiver_id = 'user-id-5', pickup_time = NOW() - INTERVAL '1 hour'
WHERE qr_code = 'ZWC-006';

UPDATE donations
SET receiver_id = 'user-id-6', pickup_time = NOW() - INTERVAL '30 minutes'
WHERE qr_code = 'ZWC-007';

UPDATE donations
SET receiver_id = 'user-id-5', pickup_time = NOW() - INTERVAL '4 hours'
WHERE qr_code = 'ZWC-008';

UPDATE donations
SET receiver_id = 'user-id-7', pickup_time = NOW() - INTERVAL '5 hours'
WHERE qr_code = 'ZWC-009';

UPDATE donations
SET receiver_id = 'user-id-8', pickup_time = NOW() - INTERVAL '6 hours'
WHERE qr_code = 'ZWC-010';
*/

-- To create collection logs:
/*
INSERT INTO collection_logs (donation_id, receiver_id, notes)
SELECT id, receiver_id, 'Successfully collected and distributed to beneficiaries'
FROM donations
WHERE status IN ('collected', 'delivered') AND receiver_id IS NOT NULL;
*/

-- Quick queries to check data:
-- SELECT COUNT(*) as total_users FROM profiles;
-- SELECT COUNT(*) as total_donations FROM donations;
-- SELECT status, COUNT(*) FROM donations GROUP BY status;
-- SELECT user_type, COUNT(*) FROM profiles GROUP BY user_type;
