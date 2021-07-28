    DROP TABLE IF EXISTS comments;

    CREATE TABLE comments(
        id SERIAL PRIMARY KEY,
        text VARCHAR NOT NULL,
        user_comment VARCHAR NOT NULL,
        image_id INT NOT NULL REFERENCES images(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );