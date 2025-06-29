CREATE TABLE assets.t_property_images (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES assets.t_property(id),
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

CREATE OR REPLACE FUNCTION assets.t_property_images_insert(
    p_property_id INTEGER,
    p_image_url TEXT,
    p_created_by INTEGER,
    p_updated_by INTEGER
)
RETURNS TABLE (
    id INTEGER,
    property_id INTEGER,
    image_url TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO assets.t_property_images (
        property_id,
        image_url,
        created_by,
        updated_by
    )
    VALUES (
        p_property_id,
        p_image_url,
        p_created_by,
        p_updated_by
    )
    RETURNING *;
END;
$$ LANGUAGE plpgsql; 