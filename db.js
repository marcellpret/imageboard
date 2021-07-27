const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY created_at DESC`);
};

module.exports.addImage = (fullUrl, title, description, username) => {
    return db.query(
        `INSERT INTO images (url, title, description, username) VALUES ($1,$2,$3,$4) RETURNING id, url, title, description, username`,
        [fullUrl, title, description, username]
    );
};
