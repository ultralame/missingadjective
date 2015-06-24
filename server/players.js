//this module is needed for gameLogic.js and matchmaker.js


var Defaults = require('./defaults.js');
var Reposition = require('./reposition.js');


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
  //choose the team with the least number of players
  //or the first team that shares the least number of players
  var minPlayers = Infinity;
  var minPlayersTeamId = 0;
  for(var teamId in roomProperties[player.room].teamNumPlayers)
  {
    if(roomProperties[player.room].teamNumPlayers[teamId] < minPlayers) {
      minPlayers = roomProperties[player.room].teamNumPlayers[teamId];
      minPlayersTeamId = parseInt(teamId);
    }
  }
  player.team = minPlayersTeamId;

  //increment the number of players for the given team
  roomProperties[player.room].teamNumPlayers[player.team]++;

  //initialize the player to not have the flag
  player.hasFlag = false;

  player.radius = Defaults.PLAYER_RADIUS;

  //put the player in the correct starting location
  //player.position = PLAYER_DEFAULT_COORDINATES[player.team];
  Reposition.getLocation(player, roomProperties);

  console.log(player.name + ' has joined team '  + player.team + ' in room ' + player.room + '.');
  console.log('Starting position: ', player.position, '.');
};


//function to remove a player from a room
module.exports.leaveRoom = function(player, roomProperties) {
  //have player leave the room
  player.leave(player.room);

  //remove the player from the room's players property
  delete roomProperties[player.room].players[player.id];

  //decrement the number of players in the room
  roomProperties[player.room].numPlayers--;

  //decrement the number of players on the team
  roomProperties[player.room].teamNumPlayers[player.team]--;

  console.log(player.name + ' has left team ' + player.team + ' from room ' + player.room + '.');
};
