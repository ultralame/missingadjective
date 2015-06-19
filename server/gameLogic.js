// Helper Functions
var helpers = require('./helpers.js');


var roomId = 0;
var roomCounter = 0;
var roomSize = 6;

var teamSize = roomSize / 2; // the maximum team size will always be half the size of the room
var teamCounter = 0; //the team number that a player will be on
var numTeams = roomSize / teamSize; //the number of teams

//a queue that holds the players that leave
//this queue is used to keep track of empty rooms
var leaveRoomQ = new helpers.Queue();

//object that stores default coordinates
var defaultCoordinates = {};
//object index is the team number
defaultCoordinates[0] = [2, 10]; // for example, these are the coordinates for team 0
defaultCoordinates[1] = [10, 2]; // and these are the coordinates for team 1





//the player is the passed in socket/client
var gameLogic = module.exports.gameLogic = function(player) {


  player.on('join', function(name) {

    player.name = name;
    player.room = roomId;
    player.join(roomId);

    //initialize teams
    if(leaveRoomQ.size() >= 1) {
      player.team = leaveRoomQ.dequeue().team;
    }
    else {
      //alternate putting players on teams
      player.team = teamCounter;
      teamCounter++;
      if(teamCounter === numTeams) {
        teamCounter = 0;
      }
    }

    //initialize game coordinates
    player.coordinates = defaultCoordinates[player.team];
    //TODO: broadcast name coords, team number, to everyone in room

    //put client in correct room
    if(leaveRoomQ.size() >= 1) {
      player.room = leaveRoomQ.dequeue().room;
    }
    else {
      roomCounter++;
      if(roomCounter === roomSize) {
        roomId++;
        roomCounter = 0;
        teamCounter = 0;
      }
    }

    console.log(player.name + " has joined team "  + player.team + " in room " + player.room + '.');
    console.log('Starting position: ' + player.coordinates + '.');
  });


  player.on('disconnect',function() {

    console.log(player.name + " has left team " + player.team + " from room " + player.room + '.');

    //TODO: broadcast to everyone in room that player has left

    player.leave(player.room);

    if(player.name !== undefined
      && player.room !== undefined) {
      leaveRoomQ.enqueue(player);
    }
  });

  player.on('movement', function(coordinates) {
    player.coordinates = coordinates;
  });

};

