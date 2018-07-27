"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.static('public'));
// app.get('/', (req, res) => {
//   res.sendfile('/static/index.html');
// });
app.listen(3000, () => {
    console.log('Listening on port ' + PORT + '...');
});
//# sourceMappingURL=index.js.map