const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("./public"));

// this info would be coming from the database!

app.get("/start", (req, res) => {
    db.getImages()
        .then(({ rows: images }) => {
            console.log("rows: ", images);
            res.json(images);
        })
        .catch((err) => {
            console.log("err: ", err);
            return err;
        });
});

app.listen(8080, () => console.log("Running on 8080"));
