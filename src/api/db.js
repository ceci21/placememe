import * as sqlite3 from 'sqlite3';
import images from './images';

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
      ORDER BY width ASC LIMIT 1
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

    images.getImageData(image_url, (result) => {
      db.run(`
            INSERT INTO memes (meme_ref, width, height) 
            VALUES ($meme_ref, $width, $height)
          `, {
            $meme_ref: meme_refs[i],
            $width: result.width,
            $height: result.height
          }
        );

      if (i === meme_refs.length - 1) {
        callback();
      }
    });
  }
};

export default {
  getAllMemes,
  getMeme,
  refreshMemeDB
};