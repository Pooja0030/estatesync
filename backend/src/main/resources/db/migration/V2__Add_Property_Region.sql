ALTER TABLE properties
ADD COLUMN region_id BIGINT;

ALTER TABLE properties
ADD CONSTRAINT fk_property_region
FOREIGN KEY (region_id) REFERENCES regions(id);

ALTER TABLE leads
ADD COLUMN region_id BIGINT;

ALTER TABLE leads
ADD CONSTRAINT fk_lead_region
FOREIGN KEY (region_id) REFERENCES regions(id);
