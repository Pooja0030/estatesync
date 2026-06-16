DELETE FROM lead_interests WHERE property_id IN (
    SELECT id FROM properties WHERE title IN (
        'Luxury Villa in Bandra West', 
        'Modern Apartment Andheri', 
        'Commercial Office Space in BKC'
    )
);

DELETE FROM properties WHERE title IN (
    'Luxury Villa in Bandra West', 
    'Modern Apartment Andheri', 
    'Commercial Office Space in BKC'
);

-- Insert realistic properties across various Mumbai regions
-- Region Mapping (from V1): 1=North, 2=South, 3=East, 4=West

INSERT INTO properties (title, description, price, type, lat, lng, region_id) VALUES 
('South Mumbai Heritage Apartment', 'Exquisite 3BHK heritage apartment in Colaba with modern amenities. Perfect for those seeking classic aesthetics.', 65000000, 'Apartment', 18.9150, 72.8258, 2),
('Navi Mumbai IT Park Space', 'Fully furnished 5000 sq.ft office space in Mahape. Includes central AC and 20 reserved parking spots.', 80000000, 'Commercial', 19.1171, 73.0146, 3),
('Borivali East Family Flat', 'Spacious 2BHK flat near Borivali National Park. Great ventilation and community spaces.', 18000000, 'Apartment', 19.2290, 72.8660, 1),
('Powai Lakeview Penthouse', 'Ultra-luxury 5BHK penthouse with a private terrace overlooking Powai Lake. Includes smart home automation.', 120000000, 'Penthouse', 19.1176, 72.9060, 3),
('Juhu Beachfront Bungalow', 'Exclusive 6BHK bungalow with direct beach access, private pool, and expansive garden.', 450000000, 'Villa', 19.1075, 72.8263, 4),
('Malad West Retail Store', 'Prime location retail space facing the main road. Ideal for high-end boutique or cafe.', 35000000, 'Commercial', 19.1843, 72.8361, 4),
('Thane West Green Valley', 'Affordable 1BHK apartment in a lush green complex. 10 mins from Thane station.', 8500000, 'Apartment', 19.2183, 72.9781, 1),
('Worli Sea Face Duplex', 'Stunning 4BHK duplex apartment with panoramic ocean views and private elevator access.', 280000000, 'Duplex', 19.0169, 72.8156, 2);
