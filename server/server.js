//server.js


var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Middleware Setup
var morgan = require('morgan'); //morgan is for debugging
var bodyParser = require('body-parser');

//serve static assets
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

//import game logic module
var gameLogic = require('./gameLogic.js');

//have the game logic module handle the game logic
io.on('connection', function(socket) {

  gameLogic(socket);

});

module.exports = server;
