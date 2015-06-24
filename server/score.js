//this module is needed for gameLogic.js
//if using events.js, then this module will instead be needed for that


var Defaults = require('./defaults.js');


var handleWin = function() {

};


var checkForWin = function() {

  //handle win if win is true
};


module.exports.updateScore = function(player, roomProperties) {

  roomProperties[player.room].teamScores[player.team]++;

  //put the flag in the default starting position
  roomProperties[player.room].flag = {position : Defaults.OBJECT_DEFAULT_COORDINATES['FLAG'], radius : Defaults.FLAG_RADIUS};

  //check for win
};