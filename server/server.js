var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Middleware Setup
var morgan = require('morgan');
var bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));



module.exports = server;
