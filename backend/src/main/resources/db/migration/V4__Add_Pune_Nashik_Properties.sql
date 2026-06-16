-- Insert regions only if they don't exist (using a safe workaround since there's no UNIQUE constraint)
INSERT INTO regions (name)
SELECT 'Pune' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM regions WHERE name = 'Pune');

INSERT INTO regions (name)
SELECT 'Nashik' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM regions WHERE name = 'Nashik');

-- Insert realistic properties for Pune
INSERT INTO properties (title, description, price, type, lat, lng, region_id) VALUES 
('Kalyani Nagar Premium Condo', '3BHK premium condo in Kalyani Nagar, Pune. Walking distance from major IT parks and lifestyle hubs.', 25000000, 'Apartment', 18.5484, 73.9033, (SELECT id FROM regions WHERE name='Pune' LIMIT 1)),
('Hinjewadi Tech Park Office', 'Spacious 4000 sq.ft commercial office in Pune''s biggest IT hub. Pre-wired and furnished.', 60000000, 'Commercial', 18.5913, 73.7389, (SELECT id FROM regions WHERE name='Pune' LIMIT 1)),
('Koregaon Park Luxury Villa', 'Beautiful 4BHK villa with a private garden in the lush green Koregaon Park area.', 50000000, 'Villa', 18.5362, 73.8939, (SELECT id FROM regions WHERE name='Pune' LIMIT 1));

-- Insert realistic properties for Nashik
INSERT INTO properties (title, description, price, type, lat, lng, region_id) VALUES 
('Sula Vineyards Resort Plot', 'Prime 2-acre agricultural/resort plot near the famous vineyards in Nashik. Excellent investment opportunity.', 15000000, 'Land', 20.0053, 73.7436, (SELECT id FROM regions WHERE name='Nashik' LIMIT 1)),
('Nashik City Centre Flat', 'Affordable 2BHK flat located directly in the heart of Nashik. Ideal for families.', 4500000, 'Apartment', 19.9975, 73.7898, (SELECT id FROM regions WHERE name='Nashik' LIMIT 1));
