//this module is needed for gameLogic.js


module.exports.createSendPlayerObj = function(player) {
  var playerToSend = {};

  playerToSend.id = player.id;
  playerToSend.name = player.name;
  playerToSend.position = player.position;
  playerToSend.team = player.team;
  playerToSend.hasFlag = player.hasFlag;

  return playerToSend;
};


module.exports.createSendEnvironmentObj = function(room) {
  var environment = {};

  environment.flag = room.flag;
  environment.base0 = room.base0;
  environment.base1 = room.base1;

  return environment;
};
