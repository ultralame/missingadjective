//score.js
//this module updates the score, checks for win, and handles the win
//this module is needed for gameLogic.js
//if using events.js, then this module will instead be needed for that


//required modules
var Defaults = require('./defaults.js'); //for default settings
var Rooms = require('./rooms.js'); //for creating and resetting rooms
var SendObject = require('./sendObject.js'); //for creating sendable objects to the clients


//function to perform the appropriate action after a win
var handleWin = function(player, roomProperties, io) {

  //reset the room after a win
  //scores, flag position, and player positions will be reset
  Rooms.resetRoom(player.room, roomProperties);

  //send object containing the winning team and the updated room properties to the clients
  var winObject = SendObject.createSendWinObject(player, roomProperties);
  console.log('winObject: ', JSON.stringify(winObject));  
  io.sockets.in(player.room).emit('winReset', JSON.stringify(winObject));

};


//function to check for a win
var checkForWin = function(player, roomProperties, io) {

  //only the scoring team can possibly be the winning team
  //check if the incremented score is the default win score
  //if so, then handle win
  if(roomProperties[player.room].teamScores[player.team] === Defaults.WIN_SCORE) {
    handleWin(player, roomProperties, io);
  }
  else {
    //put the flag in the default starting position
    roomProperties[player.room].flag = {position : Defaults.OBJECT_DEFAULT_COORDINATES['FLAG'], radius : Defaults.FLAG_RADIUS};

    //send object containing updated score and flag position to clients
    var scoreAndFlagObject = createSendScoreAndFlagObj(player, roomProperties);
    io.sockets.in(player.room).emit('updateScoreFlag', JSON.stringify(scoreAndFlagObject));
  }

};


//function to update the score and call check for win function
module.exports.updateScore = function(player, roomProperties, io) {

  //increment the score for the team that the player is on
  roomProperties[player.room].teamScores[player.team]++;

  //check for win
  checkForWin(player, roomProperties, io);

};
