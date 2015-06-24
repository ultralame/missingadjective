//this module is needed for gameLogic.js


var Defaults = require('./defaults.js');
var Rooms = require('./rooms.js');
var Players = require('./players.js');


//variable(s) to keep track of rooms
var roomId = -1; //the id associated to each room


var getFirstOpenRoom = function(roomProperties) {

  for(var roomId in roomProperties)
  {
    if(roomProperties[roomId].numPlayers < Defaults.MAX_ROOM_SIZE)
      return roomId;
  }

  return -1;
};


//function that assigns a player to a room
//  there is no real matchmaking logic at the moment
//  the function currently only assigns a player to the earliest created room with an open slot
//  or makes a new room if no created room has an open slot
module.exports.matchmaker = function(player, roomProperties) {

  //put player in correct room
  var firstOpenRoom = getFirstOpenRoom(roomProperties); //this will be the id of the first room with an empty slot
  if(firstOpenRoom >= 0) { //if there is a room with an empty slot....
    player.room = firstOpenRoom;
  }
  else { //if there is no room with an empty slot...
    roomId++;

    player.room = roomId; //put player into new room that is currently being created

    //if room hasn't been created yet, then initialize the room
    if(roomProperties.hasOwnProperty(player.room) === false)
    {
      Rooms.initRoom(player.room, roomProperties);
    }
  }

  //have player join room
  Players.joinRoom(player, roomProperties);
};
