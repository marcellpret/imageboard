const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 6`);
};

module.exports.getImage = (imgId) => {
    return db.query(`SELECT * FROM images WHERE id=$1`, [imgId]);
};

module.exports.getMoreImages = (lowestId) => {
    return db.query(
        `SELECT * ,(SELECT id FROM images ORDER BY id ASC LIMIT 1) AS "lowestId" FROM images WHERE id < $1 ORDER BY created_at DESC LIMIT 6`,
        [lowestId]
    );
};

module.exports.addImage = (fullUrl, title, description, username) => {
    return db.query(
        `INSERT INTO images (url, title, description, username) VALUES ($1,$2,$3,$4) RETURNING id, url, title, description, username`,
        [fullUrl, title, description, username]
    );
};

module.exports.getComments = (id) => {
    return db.query(
        `SELECT * FROM comments JOIN images ON comments.image_id = images.id WHERE image_id = ($1) `,
        [id]
    );
};

module.exports.addComment = (text, user_comment, image_id) => {
    return db.query(
        `INSERT INTO comments (text, user_comment, image_id) VALUES ($1,$2,$3) RETURNING text, user_comment`,
        [text, user_comment, image_id]
    );
};

module.exports.deleteComments = (id) => {
    return db.query(
        `DELETE FROM comments WHERE comments.image_id=($1) RETURNING text`,
        [id]
    );
};

module.exports.deleteImage = (id) => {
    return db.query(`DELETE FROM images WHERE images.id=($1) RETURNING id`, [
        id,
    ]);
};
