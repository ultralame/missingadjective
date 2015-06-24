//this module is needed for gameLogic.js and matchmaker.js


var Defaults = require('./defaults.js');
var Collisions = require('./collisions.js');


//valid position function will check if the position is valid (ie. no collision)
var validPosition = function(player, roomProperties) {

  //mark valid to false if there is a collision with another object

  //check against the flag
  if(Collisions.collisionDetection(player, roomProperties[player.room].flag) === true) {
    return false;
  }

  //check against all other players in the room
  var playersInRoom = roomProperties[player.room].players;
  for(var playerId in playersInRoom) {

    if(player.id === playersInRoom[playerId].id || playersInRoom[playerId].position === undefined) {
      continue;
    }

    if(Collisions.collisionDetection(player, playersInRoom[playerId]) === true) {
      return false;
    }

  }

  return true; //no collisions detected so return true
};


var getLocation = function(player, roomProperties) {

  var offset_x;
  var offset_y;  
  var range_x;
  var range_y;
  //team = 0 only spawns in left half
  if(player.team === 0) {
    offset_x = Defaults.BASE_RADIUS;
    offset_y = Defaults.BASE_RADIUS;    
    range_x = Defaults.LENGTH_X / 2 - 2 * Defaults.BASE_RADIUS;
    range_y = Defaults.LENGTH_Y - 2 * Defaults.BASE_RADIUS;    
  }
  //team = 1 only spawns in right half
  else if(player.team === 1) {
    offset_x = Defaults.LENGTH_X / 2 + Defaults.BASE_RADIUS;
    offset_y = Defaults.BASE_RADIUS;
    range_x = Defaults.LENGTH_X / 2 - 2 * Defaults.BASE_RADIUS;
    range_y = Defaults.LENGTH_Y - 2 * Defaults.BASE_RADIUS; 
  }
  //team = anything else spawns in either side
  else {
    offset_x = Defaults.BASE_RADIUS;
    offset_y = Defaults.BASE_RADIUS;
    range_x =  Defaults.LENGTH_X - 2 * Defaults.BASE_RADIUS;
    range_y = Defaults.LENGTH_Y - 2 * Defaults.BASE_RADIUS; 
  }
  
  player.position = {x : Math.random() * range_x + offset_x, y : Math.random() * range_y + offset_y};
  //keep trying to get a new random position if the selected position is invalid
  while(validPosition(player, roomProperties) === false)
  {
    player.position = {x : Math.random() * range_x + offset_x, y : Math.random() * range_y + offset_y};
  }

};


//function to put a player in a room
//and put the player on the correct team
module.exports.joinRoom = function(player, roomProperties) {
  //have player join the room
  player.join(player.room);

  //keep track of every player in the room by putting the player into the players property of the room
  //the key for each player is the player object itself
  roomProperties[player.room].players[player.id] = player;

  //increment the number of players in the room
  roomProperties[player.room].numPlayers++;

  //put the player on the appropriate team
  if(player.hasOwnProperty('team') === false) {
    //alternate putting players on different teams
    player.team = roomProperties[player.room].teamToJoin;
    roomProperties[player.room].teamToJoin++;
    if(roomProperties[player.room].teamToJoin === Defaults.NUM_TEAMS) {
      roomProperties[player.room].teamToJoin = 0;
    }
  }

  //initialize the player to not have the flag
  player.hasFlag = false;

  player.radius = Defaults.PLAYER_RADIUS;

  //put the player in the correct starting location
  //player.position = PLAYER_DEFAULT_COORDINATES[player.team];
  getLocation(player, roomProperties);

  console.log(player.name + ' has joined team '  + player.team + ' in room ' + player.room + '.');
  console.log('Starting position: ', player.position, '.');
};


//function to remove a player from a room
module.exports.leaveRoom = function(player, roomProperties, disconnectedPlayerQ) {
  //have player leave the room
  player.leave(player.room);

  //remove the player from the room's players property
  delete roomProperties[player.room].players[player.id];

  //decrement the number of players in the room
  roomProperties[player.room].numPlayers--;

  //put the disconnected player into the queue to see what room now has an open slot
  disconnectedPlayerQ.enqueue(player);

  console.log(player.name + ' has left team ' + player.team + ' from room ' + player.room + '.');
};
