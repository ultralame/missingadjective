//THIS FILE/MODULE IS NOT CURRENTLY BEING USED!!!
//use this file if events like collision detection and score checking are moved to the server
//right now, the client tells the server that it has scored
//however, if score checking is moved to the server,
//this events module would check for scoring (player collides with own team's base) and update the score
//this module would be used in the updatePosition event of the gameLogic function


//events.js
//this module is for checking events after a game update (ie. player position update)
//this module is needed for gameLogic.js


//required modules
var Collisions = require('./collisions.js'); //for collision detection
var Score = require('./score.js'); //for updating the score and win checking and handling


//function to check for player to player contact
//and also handle player to player contact
var playerToPlayerContact = function(player, roomProperties) {

  //if contact, check if contacted player has flag
  //if contacted player has flag, make the player drop the flag (and tell clients that player has dropped the flag)
  //also, prevent players from picking up the flag for 2 seconds after it drops (as per rules of the game)
};


//function to check for player to flag contact
//and also handle player to flag contact
var playerToFlagContact = function(player, roomProperties) {

  //if contact, make player pick up flag (and tell clients that player has picked up flag)
};


//function to check for player to base contact
//and also handle player to base contact
var playerToBaseContact = function(player, roomProperties) {

  //if contact, update the score ( call Score.updateScore(player, roomProperties, io) )
};


//events to check for after a player position update
module.exports.checkEvents = function(player, roomProperties) {

//player to player contact
//--player to player with a flag
  playerToPlayerContact(player, roomProperties);

//player to flag contact
  playerToFlagContact(player, roomProperties);

//player with flag entering own team's base
//--fires update score condition
//----update score function should check for game win
  playerToBaseContact(player, roomProperties);

};
