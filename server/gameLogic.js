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
PLAYER_DEFAULT_COORDINATES[0] = [2, 10]; //for example, these are the coordinates for team 0
PLAYER_DEFAULT_COORDINATES[1] = [10, 2]; //and these are the coordinates for team 1


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

};


//function to reset the room
var resetRoom = function(roomId) {

  //reset the team scores
  roomProperties[roomId].teamScore = {};
  for(var i = 0; i < NUM_TEAMS; ++i) {
    roomProperties[roomId].teamScore[i] = 0;
  }

};


//function to put a player in a room
//and put the player on the correct team
var joinRoom = function(player) {
  //have player join the room
  player.join(player.room);

  //put the player's id (memory address of the player object) into the players property of the room; the actual value stored doesn't matter
  roomProperties[player.room].players[player] = true;

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

  //put the player in the correct starting location
  player.coordinates = PLAYER_DEFAULT_COORDINATES[player.team];
  //TODO: broadcast name, coords, and team number to everyone else in room    

  console.log(player.name + ' has joined team '  + player.team + ' in room ' + player.room + '.');
  console.log('Starting position: ' + player.coordinates + '.');
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


//the player is the passed in socket/client
var gameLogic = module.exports = function(player) {

  //handle player join
  player.on('join', function(name) {

    player.name = name;

    //assign the player to the correct room 
    matchMaker(player);

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

    //check stuff here

  });

};

