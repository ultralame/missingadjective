/*
 * The purpose of this file is to initialize variables to be used throughout the app.
 */

var envVariables = { // initialize environment variables
  player: null,
  flag: null,
  base0: null,
  base1: null,
  moveSpeed: 5,
  score: { 0: 0, 1: 0 }, // key is the team number and value is the score on initialize
  playerContainer: {}, // list of all other players in the room not including yourself
  winCondition: false,
  winningTeam: null
};

var Collisions = {};  // Initialize container to hold collision detection logic

var socket = io(); // initialize socket connection


/*
To do:

Remove all canvasContext paramaters for classes and objects since it is
now global

Move client files to folders
*/
