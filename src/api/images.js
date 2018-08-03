import * as Jimp from 'jimp';

const BUCKET = 'https://s3.amazonaws.com/placememe-images-bucket-3245/';

const cropImage = (image, exp_width, exp_height, callback) => {
  try {
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
  } catch {
    console.error('Error cropping image');
  }
};

const getImageData = (meme_ref, callback) => {
  try {
    Jimp.read(meme_ref, (err, image) => {
      if (err) {
        return console.error('ERROR', err);
      }
      console.log('Image: ', image);

      const ext = image.getExtension();
      console.log('File extension:', ext);

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
  } catch {
    console.error('Error getting image data');
  }
}

export default {
  cropImage,
  getImageData
};