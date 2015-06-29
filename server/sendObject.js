//sendObject.js
//this module is for creating sendable objects to clients
//there are two reasons for creating sendable objects
//-to reduce the amount of data sent per message (game messages between server/client should have as little data as possible)
//-the full player socket objects cannot be stringified because they have properties that are not "stringifiable"
//this module is needed for gameLogic.js


//function to create a sendable object containing player data
module.exports.createSendPlayerObj = function(player) {
  var playerToSend = {};

  //the appropriate player data that needs to be sent....
  playerToSend.id = player.id;
  playerToSend.name = player.name;
  playerToSend.position = player.position;
  playerToSend.team = player.team;
  playerToSend.hasFlag = player.hasFlag;

  return playerToSend;
};


//function to create a sendable object containing room data
module.exports.createSendEnvironmentObj = function(room) {
  var environment = {};

  //the appropriate environment data that needs to be sent....
  environment.flag = room.flag;
  environment.base0 = room.base0;
  environment.base1 = room.base1;
  environment.teamScores = room.teamScores;

  return environment;
};


//function to create a sendable object containing team scores and flag position
//this object is sent after a player scores and the team score gets updated
module.exports.createSendScoreAndFlagObj = function(player, roomProperties) {
  var scoreAndFlagObject = {};

  //the scores for every team and the position of the flag....
  //(when a team scores, the clients will need to know the updated scores and updated position of the flag)
  scoreAndFlagObject.teamScores = roomProperties[player.room].teamScores;
  scoreAndFlagObject.flag = roomProperties[player.room].flag;

  return scoreAndFlagObject;
};


//function to create a sendable object containing data after a win
//this object is sent after a team wins
module.exports.createSendWinObj = function(player, roomProperties) {
  var winObject = {};

  //the id of the winning team, the position of the flag, and the scores for every team....
  //(when a team wins, the clients will need to know the winning team, the updated scores, and the updated flag position)
  winObject.winningTeamId = player.team;
  winObject.flag = roomProperties[player.room].flag;
  winObject.teamScores = roomProperties[player.room].teamScores;

  //also send the players to get their updated positions....
  //(when a team wins, the player positions get updated)
  winObject.players = {};
  for(var playerId in roomProperties[player.room].players) {
    winObject.players[playerId] = module.exports.createSendPlayerObj(roomProperties[player.room].players[playerId]);
  }

  return winObject;
};
