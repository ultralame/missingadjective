//this module is needed for gameLogic.js


var Defaults = require('./defaults.js');
var Rooms = require('./rooms.js');
var Players = require('./players.js');


//variable(s) to keep track of rooms
var roomId = 0; //the id associated to each room


//function that assigns a player to a room
//  there is no real matchmaking logic at the moment
//  the function currently only assigns a player to the earliest created room with an open slot
//  or makes a new room if no created room has an open slot
module.exports.matchmaker = function(player, roomProperties, disconnectedPlayerQ) {

  //put player in correct room
  if(disconnectedPlayerQ.size() >= 1) { //if there is a room with an empty slot....
    var firstDisconnectedPlayer = disconnectedPlayerQ.dequeue(); //get the properties of the first disconnected player; also remove the player from the queue
    player.room = firstDisconnectedPlayer.room; //this will be the first room with an empty slot
    player.team = firstDisconnectedPlayer.team; //this is the team that the player was on
  }
  else { //if there is no room with an empty slot...
    player.room = roomId; //put player into new room that is currently being created

    //if room hasn't been created yet, then initialize the room
    if(roomProperties.hasOwnProperty(player.room) === false)
    {
      Rooms.initRoom(player.room, roomProperties);
    }

    if(roomProperties[player.room].numPlayers + 1 === Defaults.MAX_ROOM_SIZE) {
      roomId++; //increment the room id if the new room is full
    }
  }

  //have player join room
  Players.joinRoom(player, roomProperties);
};
