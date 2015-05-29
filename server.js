var express = require('express');
var server = express();

server.get('/',function (req, res) {
	res.send('hola putito')
});

server.listen(3000);