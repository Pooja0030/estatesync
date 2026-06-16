ALTER TABLE leads
ADD COLUMN manager_id BIGINT;

ALTER TABLE leads
ADD CONSTRAINT fk_leads_manager
FOREIGN KEY (manager_id) REFERENCES users(id);
