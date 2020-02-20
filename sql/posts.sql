DROP TABLE IF EXISTS posts;

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    post TEXT,
    poster_id INT REFERENCES users(id),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
