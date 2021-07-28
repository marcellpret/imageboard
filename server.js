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
app.use(express.json());

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
        ).then(({ rows: lastImage }) => {
            console.log("lastImage: ", lastImage);

            res.json(lastImage[0]);
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/comments", (req, res) => {
    db.getComments(req.query.id)
        .then(({ rows: comments }) => {
            console.log("comments: ", comments);
            res.json(comments);
        })
        .catch((err) => {
            console.log("err in GET comments: ", err);
            return err;
        });
});

app.post("/comment", (req, res) => {
    console.log("req.body: ", req.body);
    const { text, user_comment, image_id } = req.body;
    db.addComment(text, user_comment, image_id)
        .then(({ rows: lastComment }) => {
            console.log("lastComment: ", lastComment);

            res.json(lastComment[0]);
        })
        .catch((err) => {
            console.log("err in POST comment: ", err);
            return err;
        });
});

app.get("/more", (req, res) => {
    db.getMoreImages(req.query.lowestId)
        .then(({ rows: moreImages }) => {
            console.log("moreImages: ", moreImages);

            res.json(moreImages);
        })
        .catch((err) => {
            console.log("err in GET more images: ", err);
            return err;
        });
});

app.listen(8080, () => console.log("Running on 8080"));
