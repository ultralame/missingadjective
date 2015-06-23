//gameLogic.js



// Helper Functions
var helpers = require('./helpers.js');



//variable(s) to keep track of rooms
var roomId = 0; //the id associated to each room


//"constant" properties that will apply to all rooms and shouldn't update
var MAX_ROOM_SIZE = 6; //the maximum number of players that a room can have
var NUM_TEAMS = 2; //the number of teams
var TEAM_SIZE = MAX_ROOM_SIZE / NUM_TEAMS; //the maximum team size will be the size of the room divided by the number of teams


//object that stores default coordinates for players
var PLAYER_DEFAULT_COORDINATES = {};
//object key/index is the team number
PLAYER_DEFAULT_COORDINATES[0] = {x : 100, y : 100}; //for example, these are the coordinates for team 0
PLAYER_DEFAULT_COORDINATES[1] = {x : 400, y : 300}; //and these are the coordinates for team 1


//object that stores default coordinates for objects in the game environment
var OBJECT_DEFAULT_COORDINATES = {};
//key is the name of the object in the environment
OBJECT_DEFAULT_COORDINATES['FLAG'] = {x : 5, y : 5}; //for example, these are the coordinates for the flag
OBJECT_DEFAULT_COORDINATES['BASE1'] = {x : 2, y : 5}; //these are the coordinates for base 1
OBJECT_DEFAULT_COORDINATES['BASE2'] = {x : 10, y : 5}; //these are the coordinates for base 2


//an object that will hold the updating properties associated to each game room
//the key is the roomId
var roomProperties = {};


//a queue that holds the players that leave
//this queue is used to keep track of empty rooms
var disconnectedPlayerQ = new helpers.Queue();


//function to initialize the room
var initRoom = function(roomId) {

  //make a new room object for the roomId
  roomProperties[roomId] = {};

  //make an object that will store the player ids of the players in the room
  roomProperties[roomId].players = {};

  //initialize the number of players in the room to zero
  roomProperties[roomId].numPlayers = 0;

  //the team number that the next joining player will join
  roomProperties[roomId].teamToJoin = 0;

  //an object that will keep track of the scores for the different teams
  //the key is the team number
  roomProperties[roomId].teamScore = {};

  //initialize scores for each team to zero
  for(var i = 0; i < NUM_TEAMS; ++i) {
    roomProperties[roomId].teamScore[i] = 0;
  }

  //put the flag in the default starting position
  roomProperties[roomId].flag = OBJECT_DEFAULT_COORDINATES['FLAG'];

  //the team that has the flag; -1 means that no team has the flag
  roomProperties[roomId].teamWithFlag = -1;
};


//function to reset the room
var resetRoom = function(roomId) {

  //reset the team scores
  roomProperties[roomId].teamScore = {};
  for(var i = 0; i < NUM_TEAMS; ++i) {
    roomProperties[roomId].teamScore[i] = 0;
  }

  //reset flag position
  roomProperties[roomId].flag = OBJECT_DEFAULT_COORDINATES['FLAG'];

  //reset team with flag; -1 means that no team has the flag
  roomProperties[roomId].teamWithFlag = -1;

  //reset player positions
  //reset players to not have the flag
  var player;
  for(var playerIndex in roomProperties[roomId].players)
  {
    player = roomProperties[roomId].players[playerIndex];
    player.coordinates = PLAYER_DEFAULT_COORDINATES[player.team];
    player.hasFlag = false;
  }

};


//function to put a player in a room
//and put the player on the correct team
var joinRoom = function(player) {
  //have player join the room
  player.join(player.room);

  //keep track of every player in the room by putting the player into the players property of the room
  //the key for each player is the player object itself
  roomProperties[player.room].players[player] = player;

  //increment the number of players in the room
  roomProperties[player.room].numPlayers++;

  //put the player on the appropriate team
  if(player.hasOwnProperty('team') === false) {
    //alternate putting players on different teams
    player.team = roomProperties[player.room].teamToJoin;
    roomProperties[player.room].teamToJoin++;
    if(roomProperties[player.room].teamToJoin === NUM_TEAMS) {
      roomProperties[player.room].teamToJoin = 0;
    }
  }

  //initialize the player to not have the flag
  player.hasFlag = false;

  //put the player in the correct starting location
  player.coordinates = PLAYER_DEFAULT_COORDINATES[player.team];
  //TODO: broadcast name, coords, and team number to everyone else in room

  console.log(player.name + ' has joined team '  + player.team + ' in room ' + player.room + '.');
  console.log('Starting position: ', player.coordinates, '.');
};


//function to remove a player from a room
var leaveRoom = function(player) {
  //have player leave the room
  player.leave(player.room);

  //remove the player from the room's players property
  delete roomProperties[player.room].players[player];

  //decrement the number of players in the room
  roomProperties[player.room].numPlayers--;

  //put the disconnected player into the queue to see what room now has an open slot
  disconnectedPlayerQ.enqueue(player);

  console.log(player.name + ' has left team ' + player.team + ' from room ' + player.room + '.');
  //TODO: broadcast to everyone else in room that player has left
};


//function that assigns a player to a room
//  there is no real matchmaking logic at the moment
//  the function currently only assigns a player to the earliest created room with an open slot
//  or makes a new room if no created room has an open slot
var matchMaker = function(player) {

  //put player in correct room
  if(disconnectedPlayerQ.size() >= 1) { //if there is a room with an empty slot....
    var firstDisconnectedPlayer = disconnectedPlayerQ.dequeue(); //get the properties of the first disconnected player; also remove the player from the queue
    player.room = firstDisconnectedPlayer.room; //this will be the first room with an empty slot
    player.team = firstDisconnectedPlayer.team; //this is the team that the player was on
  }
  else { //if there is no room with an empty slot...
    player.room = roomId; //put player into new room that is currently being created

    //if room hasn't been created yet, then initialize the room
    if(roomProperties.hasOwnProperty(player.room) === false)
    {
      initRoom(player.room);
    }

    if(roomProperties[player.room].numPlayers + 1 === MAX_ROOM_SIZE) {
      roomId++; //increment the room id if the new room is full
    }
  }

  //have player join room
  joinRoom(player);
};



var handleWin = function() {

};


var checkForWin = function() {

};


var updateScore = function() {

  //check for win
};



var playerToPlayerContact = function(player) {

  //if contact, check if contacted player has flag
};

var playerToFlagContact = function(player) {

};

var playerToBaseContact = function(player) {

  //if contact, update the score
};



//events to check for after a player position update
var checkEvents = function(player) {

//player to player contact
//--player to player with a flag
  playerToPlayerContact(player);

//player to flag contact
  playerToFlagContact(player);

//player with flag entering base
//--fires update score condition
//----check if game win (make game win function)
  playerToBaseContact(player);

};



//the player is the passed in socket/client
var gameLogic = module.exports = function(io, player) {

  //handle player join
  player.on('join', function(name) {

    player.name = name;

    //assign the player to the correct room
    matchMaker(player);

    var player_send = {};

    player_send.id = player.id;
    player_send.coordinates = player.coordinates;
    player_send.team = player.team;
    player_send.hasFlag = player.hasFlag;

    player.emit('createPlayer', JSON.stringify(player_send));

  });


  //handle player disconnect
  player.on('disconnect', function() {

    if(player.name !== undefined
      && player.room !== undefined
      && player.team !== undefined) {

      //have the player leave the room
      leaveRoom(player);

    }

  });


  //update player position
  player.on('updatePosition', function(coordinates) {
    player.coordinates = coordinates;

    //TODO: broadcast to every other player new position/coordinates of current player

    //check for events based on new player position
    checkEvents(player);

  });

};

