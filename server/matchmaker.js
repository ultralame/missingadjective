//matchmaker.js
//this module is needed to put a player in the correct room 
//this module is needed for gameLogic.js


//required modules
var Defaults = require('./defaults.js'); //for default settings
var Rooms = require('./rooms.js'); //for creating and resetting rooms
var Players = require('./players.js'); //for providing actions that a player can do (joining and leaving rooms)


//variable(s) to keep track of rooms
var roomId = -1; //the id associated to each room


//function that searches for the first room with an open player slot
var getFirstOpenRoom = function(roomProperties) {
  //return the room id of the first discovered room with an open slot
  //if the number of players in a room is less than the maximum room size, 
  //then there is an open slot
  for(var roomId in roomProperties) {
    if(roomProperties[roomId].numPlayers < Defaults.MAX_ROOM_SIZE) {
      return roomId; 
    }
  }

  return -1;
};


//function that assigns a player to a room
//  there is no real matchmaking logic at the moment
//  the function currently only assigns a player to the first discovered room with an open slot
//  or makes a new room if no created room has an open slot
module.exports.matchmaker = function(player, roomProperties) {

  //put player in correct room
  var firstOpenRoom = getFirstOpenRoom(roomProperties); //this will be the id of the first discovered room with an empty slot
  if(firstOpenRoom >= 0) { //if there is a room with an empty slot....
    player.room = firstOpenRoom; //then put the player in that room 
  }
  else { //if there is no room with an empty slot...
    roomId++; //increment roomId to create a new roomId

    player.room = roomId; //put player into the new room that is currently being created

    //if room hasn't been created yet (ie. first player hasn't joined yet), then initialize the room
    if(roomProperties.hasOwnProperty(player.room) === false)
    {
      Rooms.initRoom(player.room, roomProperties);
    }
  }

  //have player join room
  Players.joinRoom(player, roomProperties);
};
