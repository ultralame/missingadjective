// Helper Functions
var helpers = require('./helpers.js');

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

var roomId = 0;
var roomCounter = 0;
var roomSize = 6;

var teamSizeCounter = 0;
var teamSize = roomSize / 2; // the maximum team size will always be half the size of the room
var teamCounter = 0;

var leaveRoomQ = new helpers.Queue();

//object that stores default coordinates
var defaultCoordinates = {};
//object index is the team number
defaultCoordinates[0] = [2, 10]; // for example, these are the coordinates for team 0
defaultCoordinates[1] = [10, 2]; // and these are the coordinates for team 1


io.on('connection', function(socket) {

  socket.on('join', function(name) {

    socket.name = name;
    socket.room = roomId;
    socket.join(roomId);

    //initialize teams
    if(leaveRoomQ.size() >= 1) {
      socket.team = leaveRoomQ.dequeue().team;
    }
    else {
      socket.team = teamCounter;
      teamSizeCounter++;
      if(teamSizeCounter === teamSize) {
        teamCounter++;
        teamSizeCounter = 0;
      }
    }

    //initialize game coordinates
    socket.coordinate = defaultCoordinates[socket.team];

    //put client in correct room
    if(leaveRoomQ.size() >= 1) {
      socket.room = leaveRoomQ.dequeue().room;
    }
    else {
      roomCounter++;
      if(roomCounter === roomSize) {
        roomId++;
        roomCounter = 0;
        teamCounter = 0;
      }
    }

    console.log(socket.name + " has joined team "  + socket.team + " in room " + socket.room + '.');
    console.log('Starting position: ' + socket.coordinate + '.');
  });


  socket.on('disconnect',function() {

    console.log(socket.name + " has left team " + socket.team + " from room " + socket.room + '.');

    // maybe broadcast that the person has left the room
    socket.leave(socket.room);

    if(socket.room !== undefined) {
      leaveRoomQ.enqueue(socket);
    }
  });

  socket.on('keyMovement', function(coordinates) {

  });

});

module.exports = server;
