const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "newimageboardapp", // make sure you update this to your OWN bucket name if not using Spiced's credentials
            ACL: "public-read", // so people can view our files :)
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise(); // this makes putObject return a promise

    promise
        .then(() => {
            console.log("amazon upload complete!!!");
            //  OPTIONAL - this is in charge of deleting the img we just uploaded to the uploads folder
            // fs.unlink(path, () => {});
            next();
        })
        .catch((err) => {
            // uh oh
            console.log("err in s3 upload put object: ", err);
            res.sendStatus(404);
        });
};
