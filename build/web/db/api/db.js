"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database('../memes.db', (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Connected to memes database...');
});
const addMeme = () => {
};
const getMeme = (width, height) => {
};
//# sourceMappingURL=db.js.map