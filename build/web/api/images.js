"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Jimp = require("jimp");
const BUCKET = 'https://s3.amazonaws.com/placememe-images-bucket-3245/';
const cropImage = (image, exp_width, exp_height, callback) => {
    const xpos = (Number(image.width) - Number(exp_width)) / 2;
    const ypos = (Number(image.height) - Number(exp_height)) / 2;
    Jimp.read(BUCKET + image.meme_ref, (err, image) => {
        if (err) {
            return console.error(err);
        }
        image.crop(xpos, ypos, Number(exp_width), Number(exp_height));
        image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            if (err) {
                return console.error(err);
            }
            console.log('Buffer received');
            callback(buffer);
        });
    });
};
const getImageData = (meme_ref, callback) => {
    Jimp.read(meme_ref, (err, image) => {
        if (err) {
            return console.error(err);
        }
        image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            if (err) {
                return console.error(err);
            }
            callback({
                width: image.bitmap.width,
                height: image.bitmap.height,
                buffer: buffer
            });
        });
    });
};
exports.default = {
    cropImage,
    getImageData
};
//# sourceMappingURL=images.js.map