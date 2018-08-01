"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require("sqlite3");
const images_1 = require("./images");
const BUCKET = 'http://s3.amazonaws.com/placememe-images-bucket-3245/';
const db = new sqlite3.Database('./src/db/memes.db', (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Connected to memes database...');
});
const getMeme = (width, height, callback) => {
    db.get(`
    SELECT * FROM memes 
    WHERE width >= $width
    AND height >= $height
    ORDER BY id ASC LIMIT 1
  `, {
        $width: width,
        $height: height
    }, (err, result) => {
        if (err) {
            return console.error(err);
        }
        callback(result);
    });
};
const getAllMemes = (callback) => {
    db.all('SELECT * FROM memes', (err, results) => {
        if (err) {
            return console.error(err);
        }
        callback(results);
    });
};
const refreshMemeDB = (meme_refs, callback) => {
    for (let i = 0; i < meme_refs.length; i++) {
        const image_url = BUCKET + meme_refs[i];
        images_1.default.getImageData(image_url, (result) => {
            db.run(`
            INSERT INTO memes (meme_ref, width, height) 
            VALUES ($meme_ref, $width, $height)
          `, {
                $meme_ref: meme_refs[i],
                $width: result.width,
                $height: result.height
            });
            if (i === meme_refs.length - 1) {
                callback();
            }
        });
    }
};
exports.default = {
    getAllMemes,
    getMeme,
    refreshMemeDB
};
//# sourceMappingURL=db.js.map