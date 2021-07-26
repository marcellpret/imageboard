const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

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

app.post("/upload", uploader.single("file"), s3.upload, function (req, res) {
    // If nothing went wrong the file is already in the uploads directory
    console.log("req.file: ", req.file);
    console.log("req.body: ", req.body);

    if (req.file) {
        console.log("req.file: ", req.file);
        var fullUrl = `https://newimageboardapp.s3.amazonaws.com/${req.file.filename}`;
        console.log("fullUrl: ", fullUrl);

        db.addImage(
            fullUrl,
            req.body.title,
            req.body.description,
            req.body.username
        ).then(({ rows }) => {
            console.log("rows: ", rows);
        });

        res.json({
            success: true,
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log("Running on 8080"));
