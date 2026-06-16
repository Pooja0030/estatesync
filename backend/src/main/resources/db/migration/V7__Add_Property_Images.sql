CREATE TABLE property_images (
    property_id BIGINT NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
