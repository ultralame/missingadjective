//reposition.js
//this module selects a random position in the canvas that is not occupied
//this module is needed for rooms.js and players.js


//required modules
var Defaults = require('./defaults.js'); //for default settings
var Collisions = require('./collisions.js'); //for collision detection


//function to check if the player's position is a valid position (ie. no collision)
var validPosition = function(player, roomProperties) {

  //check against the flag
  //return false (not valid) if the position collides with the flag
  if(Collisions.collisionDetection(player, roomProperties[player.room].flag) === true) {
    return false;
  }

  //check against all other players in the room
  //return false (not valid) if the position collides with a player  
  var playersInRoom = roomProperties[player.room].players;
  for(var playerId in playersInRoom) {

    //don't check against self
    if(player.id === playersInRoom[playerId].id || playersInRoom[playerId].position === undefined) {
      continue;
    }

    if(Collisions.collisionDetection(player, playersInRoom[playerId]) === true) {
      return false;
    }

  }

  return true; //no collisions detected so return true
};


//function that will select a random position/location in the canvas to place a player
//the selected position must not already be occupied
module.exports.getLocation = function(player, roomProperties) {

  //variables needed to help with calculations
  var offset_x;
  var offset_y;  
  var range_x;
  var range_y;

  //team = 0, only spawn player in left half
  if(player.team === 0) {
    offset_x = Defaults.PLAYER_RADIUS;
    offset_y = Defaults.PLAYER_RADIUS;    
    range_x = Defaults.LENGTH_X / 2 - 2 * Defaults.PLAYER_RADIUS;
    range_y = Defaults.LENGTH_Y - 2 * Defaults.PLAYER_RADIUS;    
  }
  //team = 1, only spawn player in right half
  else if(player.team === 1) {
    offset_x = Defaults.LENGTH_X / 2 + Defaults.PLAYER_RADIUS;
    offset_y = Defaults.PLAYER_RADIUS;
    range_x = Defaults.LENGTH_X / 2 - 2 * Defaults.PLAYER_RADIUS;
    range_y = Defaults.LENGTH_Y - 2 * Defaults.PLAYER_RADIUS; 
  }
  //team = anything else, spawn player in either side
  else {
    offset_x = Defaults.PLAYER_RADIUS;
    offset_y = Defaults.PLAYER_RADIUS;
    range_x =  Defaults.LENGTH_X - 2 * Defaults.PLAYER_RADIUS;
    range_y = Defaults.LENGTH_Y - 2 * Defaults.PLAYER_RADIUS; 
  }
  
  //select a random position to place the player
  //Math.random * range + offset is the formula needed to select a position in the canvas where the player circle won't go out of bounds
  player.position = {x : Math.random() * range_x + offset_x, y : Math.random() * range_y + offset_y};

  //keep trying to get a new random position if the selected position is invalid
  while(validPosition(player, roomProperties) === false)
  {
    player.position = {x : Math.random() * range_x + offset_x, y : Math.random() * range_y + offset_y};
  }

};
