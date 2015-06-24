//defaults.js


var defaults = module.exports = {};


//"constant" properties that will apply to all rooms and shouldn't update
defaults.MAX_ROOM_SIZE = 10; //the maximum number of players that a room can have
defaults.NUM_TEAMS = 2; //the number of teams
defaults.TEAM_SIZE = defaults.MAX_ROOM_SIZE / defaults.NUM_TEAMS; //the maximum team size will be the size of the room divided by the number of teams


defaults.LENGTH_X = 800;
defaults.LENGTH_Y = 600;
defaults.BASE_OFFSET_X = 150;
defaults.BASE_RADIUS = 10;


defaults.FLAG_RADIUS = 2;
defaults.PLAYER_RADIUS = 10;


// //object that stores default coordinates for players
// defaults.PLAYER_DEFAULT_COORDINATES = {};
// //object key/index is the team number
// defaults.PLAYER_DEFAULT_COORDINATES[0] = {x : 100, y : 100}; //for example, these are the coordinates for team 0
// defaults.PLAYER_DEFAULT_COORDINATES[1] = {x : 400, y : 300}; //and these are the coordinates for team 1


//object that stores default coordinates for objects in the game environment
defaults.OBJECT_DEFAULT_COORDINATES = {};
//key is the name of the object in the environment
defaults.OBJECT_DEFAULT_COORDINATES['FLAG'] = {x : defaults.LENGTH_X / 2, y : defaults.LENGTH_Y / 2}; //for example, these are the coordinates for the flag
defaults.OBJECT_DEFAULT_COORDINATES['BASE0'] = {x : defaults.BASE_OFFSET_X, y : defaults.LENGTH_Y / 2}; //these are the coordinates for base 1
defaults.OBJECT_DEFAULT_COORDINATES['BASE1'] = {x : defaults.LENGTH_X - defaults.BASE_OFFSET_X, y : defaults.LENGTH_Y / 2}; //these are the coordinates for base 2


//the score needed to win the game; the first team to hit this score wins!
defaults.WIN_SCORE = 10;

