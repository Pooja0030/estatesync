CREATE TABLE regions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'MANAGER', 'AGENT') NOT NULL,
    region_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    preferred_location VARCHAR(255),
    property_type VARCHAR(50)
);

CREATE TABLE properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2),
    type VARCHAR(50),
    lat DOUBLE,
    lng DOUBLE
);

CREATE TABLE leads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    agent_id BIGINT,
    status ENUM('NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'CLOSED') NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (agent_id) REFERENCES users(id)
);

CREATE TABLE lead_interests (
    lead_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    PRIMARY KEY (lead_id, property_id),
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE lead_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lead_id BIGINT NOT NULL,
    prev_agent_id BIGINT,
    new_agent_id BIGINT,
    changed_by BIGINT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (prev_agent_id) REFERENCES users(id),
    FOREIGN KEY (new_agent_id) REFERENCES users(id),
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

CREATE TABLE visits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lead_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    visit_date DATETIME NOT NULL,
    status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Insert dummy data for initialization
INSERT INTO regions (name) VALUES ('North'), ('South'), ('East'), ('West');

-- Password for admin is 'admin123' (bcrypt hash)
INSERT INTO users (name, email, password_hash, role, region_id, is_active) 
VALUES ('Super Admin', 'admin@estatesync.com', '$2a$10$wE/.7Xw3XbJ.r6.h9H6QceOq4nZ9S.l4Z9fXmE.2m2pTf3lU6O8Gq', 'ADMIN', NULL, TRUE);

INSERT INTO properties (title, description, price, type, lat, lng) VALUES 
('Luxury Villa in Bandra West', 'A beautiful 4BHK sea-facing villa.', 150000000, 'Villa', 19.0596, 72.8295),
('Modern Apartment Andheri', '2BHK apartment close to metro station.', 25000000, 'Apartment', 19.1136, 72.8697),
('Commercial Office Space in BKC', 'Spacious office space for startups.', 500000000, 'Commercial', 19.0650, 72.8645);
