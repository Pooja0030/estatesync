-- ESTATE SYNC REALISTIC DATA SEEDER SCRIPT
-- Run this script in your MySQL interface (e.g. MySQL Workbench) to generate realistic dummy data.

-- 0. Update Database Enum to ensure it accepts the new workflow statuses
ALTER TABLE leads MODIFY COLUMN status ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'VISIT_SCHEDULED', 'CLOSED') NOT NULL DEFAULT 'NEW';

-- 1. Create Regions (Maharashtra specific)
INSERT IGNORE INTO regions (name) SELECT 'Mumbai' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM regions WHERE name = 'Mumbai');
INSERT IGNORE INTO regions (name) SELECT 'Pune' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM regions WHERE name = 'Pune');
INSERT IGNORE INTO regions (name) SELECT 'Nashik' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM regions WHERE name = 'Nashik');
INSERT IGNORE INTO regions (name) SELECT 'Nagpur' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM regions WHERE name = 'Nagpur');

-- 2. Create Managers
INSERT IGNORE INTO users (name, email, password_hash, role, region_id, is_active) VALUES 
('Rajesh Patil', 'rajesh.patil@estatesync.in', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'MANAGER', (SELECT id FROM regions WHERE name='Mumbai' LIMIT 1), true),
('Smita Deshmukh', 'smita.deshmukh@estatesync.in', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'MANAGER', (SELECT id FROM regions WHERE name='Pune' LIMIT 1), true),
('Anil Kulkarni', 'anil.kulkarni@estatesync.in', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'MANAGER', (SELECT id FROM regions WHERE name='Nashik' LIMIT 1), true),
('Pooja Joshi', 'pooja.joshi@estatesync.in', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'MANAGER', (SELECT id FROM regions WHERE name='Nagpur' LIMIT 1), true);

-- 3. Create Agents
INSERT IGNORE INTO users (name, email, password_hash, role, region_id, is_active) VALUES 
('Sameer Gokhale', 'sameer.g@estatesync.in', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'AGENT', (SELECT id FROM regions WHERE name='Mumbai' LIMIT 1), true),
('Riya Sharma', 'riya.s@estatesync.in', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'AGENT', (SELECT id FROM regions WHERE name='Mumbai' LIMIT 1), true),
('Rohan Kale', 'rohan.k@estatesync.in', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'AGENT', (SELECT id FROM regions WHERE name='Pune' LIMIT 1), true),
('Neha Jadhav', 'neha.j@estatesync.in', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'AGENT', (SELECT id FROM regions WHERE name='Pune' LIMIT 1), true),
('Vikram Pawar', 'vikram.p@estatesync.in', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'AGENT', (SELECT id FROM regions WHERE name='Nashik' LIMIT 1), true),
('Anjali Shinde', 'anjali.s@estatesync.in', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'AGENT', (SELECT id FROM regions WHERE name='Nashik' LIMIT 1), true),
('Suresh Gaikwad', 'suresh.g@estatesync.in', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'AGENT', (SELECT id FROM regions WHERE name='Nagpur' LIMIT 1), true),
('Kavita More', 'kavita.m@estatesync.in', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'AGENT', (SELECT id FROM regions WHERE name='Nagpur' LIMIT 1), true);

-- 4. Create Realistic Properties
INSERT IGNORE INTO properties (title, description, price, type, lat, lng, region_id) VALUES
('Sea View Apartment Worli', 'Ultra-luxurious 4BHK apartment facing the Arabian Sea in Worli, Mumbai. Features a private pool and clubhouse access.', 125000000, 'Apartment', 19.0163, 72.8166, (SELECT id FROM regions WHERE name='Mumbai' LIMIT 1)),
('Hinjewadi Tech Park Office', 'Spacious 5000 sq.ft commercial office space in Phase 1, Hinjewadi. Fully furnished and pre-wired for IT operations.', 85000000, 'Commercial', 18.5913, 73.7389, (SELECT id FROM regions WHERE name='Pune' LIMIT 1)),
('Sula Vineyards Resort Plot', 'Prime 2-acre plot near Sula Vineyards, Nashik. Perfect for building a luxury resort or a private weekend farmhouse.', 25000000, 'Land', 20.0053, 73.7436, (SELECT id FROM regions WHERE name='Nashik' LIMIT 1)),
('Dharampeth Premium Row House', 'Elegant 3BHK row house located in the highly sought-after Dharampeth area of Nagpur. Includes a private garden.', 35000000, 'Villa', 19.1417, 79.0664, (SELECT id FROM regions WHERE name='Nagpur' LIMIT 1));

-- 5. Create Realistic Customers
INSERT IGNORE INTO customers (name, email, phone, is_email_verified, preferred_location, property_type) VALUES
('Amit Thackeray', 'amit.t@gmail.com', '9812345671', true, 'Mumbai', 'Apartment'),
('Sneha Kadam', 'sneha.kadam88@yahoo.com', '9812345672', true, 'Pune', 'Commercial'),
('Rahul Chavan', 'rahul.c.tech@outlook.com', '9812345673', true, 'Nashik', 'Land'),
('Priya Bhosale', 'priya.bhosale@gmail.com', '9812345674', true, 'Nagpur', 'Villa'),
('Vikas Mane', 'vikas.mane.biz@gmail.com', '9812345675', true, 'Mumbai', 'Apartment');

-- 6. Create Leads
INSERT IGNORE INTO leads (customer_id, agent_id, manager_id, region_id, status) VALUES
((SELECT id FROM customers WHERE phone='9812345671' LIMIT 1), (SELECT id FROM users WHERE email='sameer.g@estatesync.in' LIMIT 1), (SELECT id FROM users WHERE email='rajesh.patil@estatesync.in' LIMIT 1), (SELECT id FROM regions WHERE name='Mumbai' LIMIT 1), 'NEGOTIATION'),
((SELECT id FROM customers WHERE phone='9812345672' LIMIT 1), (SELECT id FROM users WHERE email='rohan.k@estatesync.in' LIMIT 1), (SELECT id FROM users WHERE email='smita.deshmukh@estatesync.in' LIMIT 1), (SELECT id FROM regions WHERE name='Pune' LIMIT 1), 'QUALIFIED'),
((SELECT id FROM customers WHERE phone='9812345673' LIMIT 1), (SELECT id FROM users WHERE email='vikram.p@estatesync.in' LIMIT 1), (SELECT id FROM users WHERE email='anil.kulkarni@estatesync.in' LIMIT 1), (SELECT id FROM regions WHERE name='Nashik' LIMIT 1), 'CONTACTED'),
((SELECT id FROM customers WHERE phone='9812345674' LIMIT 1), (SELECT id FROM users WHERE email='suresh.g@estatesync.in' LIMIT 1), (SELECT id FROM users WHERE email='pooja.joshi@estatesync.in' LIMIT 1), (SELECT id FROM regions WHERE name='Nagpur' LIMIT 1), 'NEW'),
((SELECT id FROM customers WHERE phone='9812345675' LIMIT 1), (SELECT id FROM users WHERE email='riya.s@estatesync.in' LIMIT 1), (SELECT id FROM users WHERE email='rajesh.patil@estatesync.in' LIMIT 1), (SELECT id FROM regions WHERE name='Mumbai' LIMIT 1), 'PROPOSAL_SENT');

-- 7. Link Lead Interests
INSERT IGNORE INTO lead_interests (lead_id, property_id) VALUES
((SELECT id FROM leads WHERE customer_id=(SELECT id FROM customers WHERE phone='9812345671' LIMIT 1) LIMIT 1), (SELECT id FROM properties WHERE title='Sea View Apartment Worli' LIMIT 1)),
((SELECT id FROM leads WHERE customer_id=(SELECT id FROM customers WHERE phone='9812345672' LIMIT 1) LIMIT 1), (SELECT id FROM properties WHERE title='Hinjewadi Tech Park Office' LIMIT 1)),
((SELECT id FROM leads WHERE customer_id=(SELECT id FROM customers WHERE phone='9812345673' LIMIT 1) LIMIT 1), (SELECT id FROM properties WHERE title='Sula Vineyards Resort Plot' LIMIT 1)),
((SELECT id FROM leads WHERE customer_id=(SELECT id FROM customers WHERE phone='9812345674' LIMIT 1) LIMIT 1), (SELECT id FROM properties WHERE title='Dharampeth Premium Row House' LIMIT 1)),
((SELECT id FROM leads WHERE customer_id=(SELECT id FROM customers WHERE phone='9812345675' LIMIT 1) LIMIT 1), (SELECT id FROM properties WHERE title='Sea View Apartment Worli' LIMIT 1));
