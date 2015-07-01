//server.js
//this module listens for client connections and passes the socket to the game logic module


//required files
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//middleware setup
var morgan = require('morgan'); //morgan is for debugging
var bodyParser = require('body-parser');

//serve static assets
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../public')));

//import game logic module
var gameLogic = require('./gameLogic.js');
var audioLogic = require('./audioLogic.js');

//listen for client connections
io.on('connection', function(socket) {

  //have the game logic module handle the game logic
  gameLogic(io, socket);

  //separate function to handle audio effects
  audioLogic(io, socket);

});

module.exports = server;
