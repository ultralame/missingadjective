//this module is needed for rooms.js and players.js


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


module.exports.getLocation = function(player, roomProperties) {

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
