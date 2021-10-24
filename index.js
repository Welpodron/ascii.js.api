const express = require('express');

const ascii = require('./routes/ascii/ascii');
const braille = require('./routes/braille/braille');

const PORT = process.env.PORT ?? 8080;

const app = express();
app.use('/ascii', ascii);
app.use('/braille', braille);

app.listen(PORT);
