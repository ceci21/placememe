"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const xml2js = require("xml2js");
const db_1 = require("./api/db");
const images_1 = require("./api/images");
const app = express();
const BUCKET = 'http://s3.amazonaws.com/placememe-images-bucket-3245/';
const PORT = 3000;
app.use(express.static('src/public'));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.status(200).send('good!');
});
app.get('/memes', (req, res) => {
    db_1.default.getAllMemes((results) => {
        res.status(200).send(results);
    });
});
app.get('/memes/:width/:height', (req, res) => {
    const width = req.params.width;
    const height = req.params.height;
    db_1.default.getMeme(width, height, (result) => {
        res.status(200).send(result);
    });
});
app.get('/db/refresh', (req, res) => {
    http.get('http://s3.amazonaws.com/placememe-images-bucket-3245/', (response) => {
        const { statusCode } = response;
        const contentType = response.headers['content-type'];
        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
        }
        else if (!/^application\/xml/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                `Expected application/xml but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // consume response data to free up memory
            response.resume();
            return;
        }
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', (chunk) => { rawData += chunk; });
        response.on('end', () => {
            xml2js.parseString(rawData, (err, result) => {
                if (err) {
                    return console.error(err);
                }
                console.log('RESULT5:', JSON.stringify(result));
                let meme_refs = [];
                for (let i = 0; i < result.ListBucketResult.Contents.length; i++) {
                    const file = result.ListBucketResult.Contents[i].Key[0];
                    meme_refs.push(file);
                }
                db_1.default.refreshMemeDB(meme_refs, () => {
                    console.log('Everything inserted into DB');
                    res.status(200).send('OK');
                });
            });
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
});
app.get('/:width/:height', (req, res) => {
    const exp_width = req.params.width;
    const exp_height = req.params.height;
    if (isNaN(Number(exp_width)) || isNaN(Number(exp_height))) {
        return res.redirect('/');
    }
    db_1.default.getMeme(exp_width, exp_height, (result) => {
        images_1.default.cropImage(result, exp_width, exp_height, (buffer) => {
            res.type('png').status(200).send(buffer);
        });
    });
});
app.listen(3000, () => {
    console.log('Listening on port ' + PORT + '...');
});
//# sourceMappingURL=index.js.map