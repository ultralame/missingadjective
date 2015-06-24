//this module is needed for gameLogic.js


var Score = require('./score.js');


var playerToPlayerContact = function(player, roomProperties) {

  //if contact, check if contacted player has flag
};


var playerToFlagContact = function(player, roomProperties) {

};


var playerToBaseContact = function(player, roomProperties) {

  //if contact, update the score
};


//events to check for after a player position update
module.exports.checkEvents = function(player, roomProperties) {

//player to player contact
//--player to player with a flag
  playerToPlayerContact(player, roomProperties);

//player to flag contact
  playerToFlagContact(player, roomProperties);

//player with flag entering base
//--fires update score condition
//----check if game win (make game win function)
  playerToBaseContact(player, roomProperties);

};
