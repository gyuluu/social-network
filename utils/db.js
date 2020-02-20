const spicedPg = require("spiced-pg");

const db = spicedPg(`postgres:postgres:postgres@localhost:5432/grandiose`);

exports.addUser = function(first, last, email, password) {
    return db
        .query(
            `INSERT INTO users (first, last, email, password)
                VALUES ($1, $2, $3, $4)
                RETURNING id`,
            [first, last, email, password]
        )
        .then(({ rows }) => {
            return rows[0].id;
        });
};

exports.addPosting = function(post, poster_id, user_id) {
    return db
        .query(
            `INSERT INTO posts (post, poster_id, user_id)
                VALUES ($1, $2, $3)
                RETURNING *`,
            [post, poster_id, user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.addChatMessage = function(sender_id, message) {
    return db
        .query(
            `INSERT INTO chats (sender_id, message)
                VALUES ($1, $2)
                RETURNING *`,
            [sender_id, message]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.addRelationship = function(receiver, sender, accepted) {
    return db
        .query(
            `INSERT INTO friendships (receiver_id, sender_id, accepted)
                VALUES ($1, $2, $3)
                RETURNING *`,
            [receiver, sender, accepted]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.cancelRelationship = function(otherId, id) {
    return db
        .query(
            `DELETE FROM friendships WHERE (receiver_id=$1 AND sender_id=$2) OR (receiver_id=$2 AND sender_id=$1)`,
            [otherId, id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.acceptRelationship = function(otherId, id, accepted) {
    return db
        .query(
            `UPDATE friendships SET accepted=$3 WHERE (receiver_id=$1 AND sender_id=$2) OR (receiver_id=$2 AND sender_id=$1)`,
            [otherId, id, accepted]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.insertUserImage = function(id, url) {
    return db.query(
        `UPDATE users SET url=$2 WHERE users.id = $1 RETURNING url`,
        [id, url]
    );
};

exports.insertBio = function(id, bio) {
    return db.query(
        `UPDATE users SET bio=$2 WHERE users.id = $1 RETURNING bio`,
        [id, bio]
    );
};

exports.getHash = function(email) {
    return db
        .query(`SELECT password, id FROM users WHERE email=$1`, [email])
        .then(({ rows }) => {
            return rows;
        });
};

exports.getUserInfo = function(id) {
    return db
        .query(
            `SELECT id, first, last, email, url, bio FROM users WHERE id=$1`,
            [id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getLastUsers = function(id) {
    return db
        .query(
            `SELECT id, first, last, url FROM users WHERE id<>$1 ORDER BY created_at DESC LIMIT 3`,
            [id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getPosts = function(id) {
    return db
        .query(
            `SELECT posts.id, posts.post, users.url FROM posts JOIN users ON users.id = posts.poster_id WHERE posts.user_id=$1 ORDER BY posts.created_at DESC LIMIT 30`,
            [id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getLastTenChatMessages = function() {
    return db
        .query(
            `SELECT users.first, users.last, users.url, chats.id, chats.sender_id, chats.message, chats.created_at FROM chats JOIN users ON users.id = chats.sender_id ORDER BY chats.created_at DESC LIMIT 10`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getSearchUsers = function(val) {
    return db
        .query(
            `SELECT id, first, last, url FROM users WHERE first || ' ' || last ILIKE $1`,
            [val + "%"]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getFriendshipStatus = function(otherId, id) {
    return db
        .query(
            `SELECT * from friendships WHERE (receiver_id=$1 AND sender_id=$2) OR (receiver_id=$2 AND sender_id=$1)`,
            [otherId, id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getFriendsWannabes = function(id) {
    return db
        .query(
            `
    SELECT users.id, first, last, url, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
            `,
            [id]
        )
        .then(({ rows }) => {
            return rows;
        });
};
