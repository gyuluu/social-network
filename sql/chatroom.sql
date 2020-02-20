DROP TABLE IF EXISTS chats;

CREATE TABLE chats (
        id SERIAL PRIMARY KEY,
        sender_id INT NOT NULL REFERENCES users(id),
        message VARCHAR(1000),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chats (sender_id, message) VALUES (83, 'i am grateful for this course');

INSERT INTO chats (sender_id, message) VALUES (83, 'i love my life');

INSERT INTO chats (sender_id, message) VALUES (83, 'my job is ideal');
