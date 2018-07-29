import * as express from 'express';
import * as Jimp from 'jimp';
import * as path from 'path';

const app = express();

const PORT = 3000;

app.use(express.static('src/public'))

app.get('/', (req, res) => {
  res.status(200).send('good!');
});

app.get('/testing', (req, res) => {
  Jimp.read('./src/db/37870482_600827720311698_1512731049799450624_n.jpg', (err, image) => {
    if (err) {
      return console.error(err);
    }
    image.scale(2);
    image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
      if (err) {
        return console.error(err);
      }
      res.type('png').status(200).send(buffer);
    });
  });
});


app.listen(3000, () => {
  console.log('Listening on port ' + PORT + '...');
});