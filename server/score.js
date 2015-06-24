//this module is needed for gameLogic.js
//if using events.js, then this module will instead be needed for that


var Defaults = require('./defaults.js');
var Rooms = require('./rooms.js');
var SendObject = require('./sendObject.js');


var handleWin = function(player, roomProperties, io) {


  var updatePosition = function(position, hasFlag) {

    player.position = JSON.parse(position);
    player.hasFlag = JSON.parse(hasFlag);

    if(player.hasFlag === true) {
      roomProperties[player.room].flag.position = player.position;
      player.broadcast.to(player.room).emit('broadcastFlagPosition', JSON.stringify(roomProperties[player.room].flag));
    }

    playerToSend = SendObject.createSendPlayerObj(player);
    player.broadcast.to(player.room).emit('broadcastPlayerPosition', JSON.stringify(playerToSend));

  };


  //disable update position listener
  player.removeListener('updatePosition', updatePosition);

  Rooms.resetRoom(player.room, roomProperties);

  var winObject = {};
  winObject.winningTeamId = player.team;
  winObject.flag = roomProperties[player.room].flag;
  winObject.teamScores = roomProperties[player.room].teamScores;

  winObject.players = {};
  for(var playerId in roomProperties[player.room].players) {
    winObject.players[playerId] = SendObject.createSendPlayerObj(roomProperties[player.room].players[playerId]);
  }

  console.log('winObject: ', JSON.stringify(winObject));  
  io.sockets.in(player.room).emit('winReset', JSON.stringify(winObject));

  //reenable update position listener
  player.on('updatePosition', updatePosition); 

};


var checkForWin = function(player, roomProperties, io) {

  //check if the incremented score is the default win score
  //if so, then handle win
  if(roomProperties[player.room].teamScores[player.team] === Defaults.WIN_SCORE) {
    handleWin(player, roomProperties, io);
  }
  else {
    //put the flag in the default starting position
    roomProperties[player.room].flag = {position : Defaults.OBJECT_DEFAULT_COORDINATES['FLAG'], radius : Defaults.FLAG_RADIUS};

    var scoreAndFlagObject = {};
    scoreAndFlagObject.teamScores = roomProperties[player.room].teamScores;
    scoreAndFlagObject.flag = roomProperties[player.room].flag;
    io.sockets.in(player.room).emit('updateScoreFlag', JSON.stringify(scoreAndFlagObject));
  }

};


module.exports.updateScore = function(player, roomProperties, io) {

  //increment the score for the team that the player is on
  roomProperties[player.room].teamScores[player.team]++;

  //check for win
  checkForWin(player, roomProperties, io);

};