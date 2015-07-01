//defaults.js
//this module contains default properties needed for various server modules


//object that will contain all of the default properties
var defaults = module.exports = {};


//the following are "constant" properties that shouldn't be updated at runtime

//default room properties
defaults.MAX_ROOM_SIZE = 10; //the maximum number of players that a room can have
defaults.NUM_TEAMS = 2; //the number of teams
defaults.TEAM_SIZE = defaults.MAX_ROOM_SIZE / defaults.NUM_TEAMS; //the maximum team size will be the size of the room divided by the number of teams

//default environment and canvas properties
defaults.LENGTH_X = 800; //x length of canvas
defaults.LENGTH_Y = 600; //y length of canvas
defaults.BASE_OFFSET_X = 150; //x offset (from the right and from the left of the canvas edges) for the bases
defaults.BASE_RADIUS = 10; //radius of the bases
defaults.FLAG_RADIUS = 2; //radius of the flag
defaults.PLAYER_RADIUS = 10; //radius of the players
defaults.FLAG_RANGE = 550; //range of position for the flag reset
defaults.FLAG_OFFSET_Y = 25; // offset from the right and left edges as a placement buffer

// //object that stores default coordinates for players
// defaults.PLAYER_DEFAULT_COORDINATES = {};
// //object key/index is the team number
// defaults.PLAYER_DEFAULT_COORDINATES[0] = {x : 100, y : 100}; //for example, these are the coordinates for team 0
// defaults.PLAYER_DEFAULT_COORDINATES[1] = {x : 400, y : 300}; //and these are the coordinates for team 1

//object that stores default coordinates for objects in the game environment
defaults.OBJECT_DEFAULT_COORDINATES = {};
//key is the name of the object in the environment

// 3JS Defaults
defaults.OBJECT_DEFAULT_COORDINATES['flag'] = {x : 0, y : 0}; //for example, these are the coordinates for the flag
defaults.OBJECT_DEFAULT_COORDINATES['base0'] = {x : 160, y : 160}; //these are the coordinates for base 1
defaults.OBJECT_DEFAULT_COORDINATES['base1'] = {x : -160, y : -160}; //these are the coordinates for base 2

// Canvas Defaults
// defaults.OBJECT_DEFAULT_COORDINATES['flag'] = {x : defaults.LENGTH_X / 2, y : defaults.LENGTH_Y / 2}; //for example, these are the coordinates for the flag
// defaults.OBJECT_DEFAULT_COORDINATES['base0'] = {x : defaults.BASE_OFFSET_X, y : defaults.LENGTH_Y / 2}; //these are the coordinates for base 1
// defaults.OBJECT_DEFAULT_COORDINATES['base1'] = {x : defaults.LENGTH_X - defaults.BASE_OFFSET_X, y : defaults.LENGTH_Y / 2}; //these are the coordinates for base 2

//the score needed to win the game; the first team to hit this score wins!
defaults.WIN_SCORE = 4;

