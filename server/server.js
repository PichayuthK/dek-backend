var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello express');
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});