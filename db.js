const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images`);
};

module.exports.addImage = (fullUrl, title, description, username) => {
    return db.query(
        `INSERT INTO images (url, title, description, username) VALUES ($1,$2,$3,$4)`,
        [fullUrl, title, description, username]
    );
};
